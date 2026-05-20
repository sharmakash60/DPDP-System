import streamlit as st
import pandas as pd
import json
import tempfile
import shutil
import zipfile
from pathlib import Path
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from ml_model import prepare_features, detect_anomalies
from rules import build_catalog, write_rule_file, run_scan, RULE_FILE_NAME

# ─── Page Config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="DPDP Compliance Scanner",
    page_icon="🔐",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ─── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
    /* Main background */
    .stApp { background-color: #0f1117; }

    /* Metric cards */
    [data-testid="metric-container"] {
        background: linear-gradient(135deg, #1e2130 0%, #252a3a 100%);
        border: 1px solid #2e3454;
        border-radius: 12px;
        padding: 16px 20px !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    [data-testid="metric-container"] label {
        color: #8b92b3 !important;
        font-size: 0.78rem !important;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }
    [data-testid="metric-container"] [data-testid="stMetricValue"] {
        color: #e2e8f0 !important;
        font-size: 1.9rem !important;
        font-weight: 700;
    }

    /* Section headers */
    .section-header {
        font-size: 1.1rem;
        font-weight: 600;
        color: #a5b4fc;
        letter-spacing: 0.04em;
        margin: 1.4rem 0 0.6rem 0;
        border-left: 3px solid #6366f1;
        padding-left: 10px;
    }

    /* Severity badge pills */
    .badge-high   { background:#ff4d4f22; color:#ff4d4f; border:1px solid #ff4d4f55;
                    border-radius:20px; padding:2px 10px; font-size:0.78rem; font-weight:600; }
    .badge-medium { background:#fa8c1622; color:#fa8c16; border:1px solid #fa8c1655;
                    border-radius:20px; padding:2px 10px; font-size:0.78rem; font-weight:600; }
    .badge-low    { background:#52c41a22; color:#52c41a; border:1px solid #52c41a55;
                    border-radius:20px; padding:2px 10px; font-size:0.78rem; font-weight:600; }

    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] {
        background-color: #1a1e2e;
        border-radius: 10px;
        padding: 4px;
        gap: 4px;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        padding: 8px 20px;
        color: #8b92b3;
        font-weight: 500;
    }
    .stTabs [aria-selected="true"] {
        background-color: #6366f1 !important;
        color: white !important;
    }

    /* Upload box */
    [data-testid="stFileUploader"] {
        background: #1a1e2e;
        border: 2px dashed #2e3454;
        border-radius: 12px;
        padding: 10px;
    }

    /* Divider */
    hr { border-color: #2e3454 !important; }

    /* Alert boxes */
    .stSuccess { background: #1a2b1a; border-color: #52c41a; }
    .stError   { background: #2b1a1a; border-color: #ff4d4f; }
    .stWarning { background: #2b2216; border-color: #fa8c16; }

    /* Dataframe */
    [data-testid="stDataFrame"] { border-radius: 10px; overflow: hidden; }
</style>
""", unsafe_allow_html=True)


# ─── Helper: Plotly theme ─────────────────────────────────────────────────────
PLOTLY_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Inter, sans-serif", color="#c9d1d9", size=12),
    margin=dict(l=10, r=10, t=40, b=10),
)

SEVERITY_COLORS = {
    "high":   "#ff4d4f",
    "medium": "#fa8c16",
    "low":    "#52c41a",
}

FRAMEWORK_COLORS = ["#6366f1", "#22d3ee", "#a78bfa", "#f472b6", "#34d399"]


def styled_metric(label: str, value, delta=None):
    """Render a metric (wrapper)."""
    if delta is not None:
        st.metric(label, value, delta)
    else:
        st.metric(label, value)


def render_charts(df: pd.DataFrame):
    """Render all dashboard charts for a findings dataframe."""

    # ── Row 1: Severity Pie  |  Framework Pie ──
    col1, col2 = st.columns(2)

    with col1:
        st.markdown('<p class="section-header">🎯 Severity Distribution</p>', unsafe_allow_html=True)
        sev_counts = df["severity"].value_counts().reset_index()
        sev_counts.columns = ["Severity", "Count"]
        colors = [SEVERITY_COLORS.get(s, "#888") for s in sev_counts["Severity"]]
        fig = go.Figure(go.Pie(
            labels=sev_counts["Severity"].str.capitalize(),
            values=sev_counts["Count"],
            marker=dict(colors=colors, line=dict(color="#0f1117", width=2)),
            hole=0.55,
            textinfo="percent+label",
            textfont=dict(size=13),
        ))
        fig.update_layout(**PLOTLY_LAYOUT, height=300,
                          showlegend=False,
                          annotations=[dict(text=f"<b>{len(df)}</b><br>Issues",
                                            font=dict(size=14, color="#e2e8f0"),
                                            showarrow=False)])
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    with col2:
        st.markdown('<p class="section-header">🏛️ Framework Distribution</p>', unsafe_allow_html=True)
        fw_counts = df["framework"].value_counts().reset_index()
        fw_counts.columns = ["Framework", "Count"]
        fig = go.Figure(go.Pie(
            labels=fw_counts["Framework"],
            values=fw_counts["Count"],
            marker=dict(colors=FRAMEWORK_COLORS, line=dict(color="#0f1117", width=2)),
            hole=0.55,
            textinfo="percent+label",
            textfont=dict(size=13),
        ))
        fig.update_layout(**PLOTLY_LAYOUT, height=300, showlegend=False)
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    # ── Row 2: Risk Score Distribution ──
    st.markdown('<p class="section-header">📈 Risk Score Distribution</p>', unsafe_allow_html=True)
    risk_df = df.copy()
    risk_df["risk_label"] = risk_df["risk_score"].apply(
        lambda x: "🚨 High" if x >= 4 else ("⚠️ Medium" if x >= 2 else "✅ Low")
    )
    risk_colors = risk_df["risk_score"].apply(
        lambda x: "#ff4d4f" if x >= 4 else ("#fa8c16" if x >= 2 else "#52c41a")
    ).tolist()

    fig = go.Figure(go.Bar(
        x=list(range(len(risk_df))),
        y=risk_df["risk_score"],
        marker=dict(color=risk_colors, line=dict(width=0)),
        hovertemplate="<b>Finding #%{x}</b><br>Risk Score: %{y}<extra></extra>",
    ))
    fig.update_layout(
        **PLOTLY_LAYOUT,
        height=220,
        xaxis=dict(showgrid=False, showticklabels=False, title="Findings"),
        yaxis=dict(showgrid=True, gridcolor="#2e3454", title="Risk Score", dtick=1),
    )
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    # ── Row 3: Top Categories  |  Anomaly Breakdown ──
    col3, col4 = st.columns(2)

    with col3:
        st.markdown('<p class="section-header">📂 Top Violated Categories</p>', unsafe_allow_html=True)
        cat_counts = df["category"].value_counts().head(10).reset_index()
        cat_counts.columns = ["Category", "Count"]
        cat_counts = cat_counts.sort_values("Count")   # ascending for horizontal bar
        fig = go.Figure(go.Bar(
            x=cat_counts["Count"],
            y=cat_counts["Category"],
            orientation="h",
            marker=dict(
                color=cat_counts["Count"],
                colorscale=[[0, "#2e3454"], [0.5, "#6366f1"], [1, "#a78bfa"]],
                line=dict(width=0),
            ),
            text=cat_counts["Count"],
            textposition="outside",
        ))
        fig.update_layout(
            **PLOTLY_LAYOUT,
            height=320,
            xaxis=dict(showgrid=True, gridcolor="#2e3454", title="Count"),
            yaxis=dict(showgrid=False, automargin=True),
        )
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    with col4:
        st.markdown('<p class="section-header">🤖 ML Anomaly Detection</p>', unsafe_allow_html=True)
        if "anomaly" in df.columns:
            anom_counts = df["anomaly"].map({0: "Normal", 1: "Anomaly"}).value_counts().reset_index()
            anom_counts.columns = ["Type", "Count"]
            fig = go.Figure(go.Bar(
                x=anom_counts["Type"],
                y=anom_counts["Count"],
                marker=dict(
                    color=["#6366f1" if t == "Normal" else "#ff4d4f" for t in anom_counts["Type"]],
                    line=dict(width=0),
                ),
                text=anom_counts["Count"],
                textposition="outside",
            ))
            fig.update_layout(
                **PLOTLY_LAYOUT,
                height=320,
                xaxis=dict(showgrid=False),
                yaxis=dict(showgrid=True, gridcolor="#2e3454", title="Count"),
            )
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
        else:
            st.info("ML anomaly data not available.")

    # ── Row 4: Severity × Framework Heatmap ──
    st.markdown('<p class="section-header">🗺️ Severity × Framework Heatmap</p>', unsafe_allow_html=True)
    pivot = df.pivot_table(index="severity", columns="framework", aggfunc="size", fill_value=0)
    fig = px.imshow(
        pivot,
        color_continuous_scale=[[0, "#1a1e2e"], [0.4, "#3b3f8c"], [1, "#ff4d4f"]],
        text_auto=True,
        aspect="auto",
    )
    fig.update_layout(**PLOTLY_LAYOUT, height=220, coloraxis_showscale=False)
    fig.update_traces(textfont=dict(size=14, color="white"))
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})


# ─── Scan Logic ───────────────────────────────────────────────────────────────
def do_scan(target_path: Path, framework: str) -> dict | None:
    rule_path = Path(RULE_FILE_NAME)
    if not rule_path.exists():
        write_rule_file(rule_path)
    try:
        return run_scan(
            rule_path=rule_path,
            target=target_path,
            framework=None if framework == "ALL" else framework,
        )
    except Exception as exc:
        st.error(f"❌ Scan error: {exc}")
        return None


def process_result(result: dict):
    """Render scan results — metrics, ML analysis, charts, table, download."""

    # ── Summary KPIs ──
    st.markdown('<p class="section-header">📊 Scan Summary</p>', unsafe_allow_html=True)
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Files Scanned",   result["files_scanned"])
    k2.metric("Rules Evaluated", result["rules_evaluated"])
    k3.metric("✅ Passed",        result["rules_passed"])
    k4.metric("❌ Failed",        result["rules_failed"])

    findings = result.get("findings", [])

    if not findings:
        st.success("🎉 No compliance issues found!")
        _download_button(result)
        return

    # ── ML Processing ──
    raw_df = pd.DataFrame(findings)
    features = prepare_features(findings)
    features = detect_anomalies(features)
    df = pd.concat([raw_df.reset_index(drop=True), features.reset_index(drop=True)], axis=1)

    # ── Risk KPIs ──
    total = len(df)
    high   = len(df[df["risk_score"] >= 4])
    medium = len(df[(df["risk_score"] >= 2) & (df["risk_score"] < 4)])
    low    = len(df[df["risk_score"] < 2])

    r1, r2, r3, r4 = st.columns(4)
    r1.metric("Total Issues",   total)
    r2.metric("🚨 High Risk",   high)
    r3.metric("⚠️ Medium Risk", medium)
    r4.metric("✅ Low Risk",    low)

    # ── Charts ──
    st.markdown("---")
    render_charts(df)

    # ── Full Findings Table ──
    st.markdown("---")
    st.markdown('<p class="section-header">🔍 All Findings</p>', unsafe_allow_html=True)

    display_cols = ["rule", "framework", "category", "severity", "title", "risk_score", "anomaly"]
    display_cols = [c for c in display_cols if c in df.columns]

    search = st.text_input("🔎 Filter findings", placeholder="Search rule, category, title…")
    sev_filter = st.multiselect("Severity filter", ["high", "medium", "low"],
                                default=["high", "medium", "low"])

    filtered = df[df["severity"].isin(sev_filter)]
    if search:
        mask = filtered.apply(
            lambda row: row.astype(str).str.contains(search, case=False).any(), axis=1
        )
        filtered = filtered[mask]

    st.caption(f"Showing **{len(filtered)}** of **{total}** findings")
    st.dataframe(
        filtered[display_cols].rename(columns={
            "rule": "Rule", "framework": "Framework", "category": "Category",
            "severity": "Severity", "title": "Title",
            "risk_score": "Risk Score", "anomaly": "Anomaly"
        }),
        use_container_width=True,
        height=350,
    )

    # ── High Risk Detail ──
    if high > 0:
        with st.expander(f"🚨 View {high} High-Risk Findings"):
            st.dataframe(df[df["risk_score"] >= 4][display_cols],
                         use_container_width=True)

    _download_button(result)


def _download_button(result: dict):
    st.markdown("---")
    st.download_button(
        label="⬇️ Download Full Report (JSON)",
        data=json.dumps(result, indent=2),
        file_name="compliance_report.json",
        mime="application/json",
        use_container_width=True,
    )


# ─── App Layout ───────────────────────────────────────────────────────────────
st.markdown("""
<div style="display:flex; align-items:center; gap:12px; margin-bottom:0.5rem">
    <span style="font-size:2.2rem">🔐</span>
    <div>
        <h1 style="margin:0; color:#e2e8f0; font-size:1.8rem; font-weight:700">
            DPDP + SOC2 Compliance Scanner
        </h1>
        <p style="margin:0; color:#8b92b3; font-size:0.9rem">
            Automated compliance analysis powered by ML anomaly detection
        </p>
    </div>
</div>
""", unsafe_allow_html=True)

st.markdown("---")

tabs = st.tabs(["🏠 Dashboard", "📂 Scan Path", "⬆️ Upload & Scan", "📜 Rules Catalog", "⚙️ Generate"])


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 0 — DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════
with tabs[0]:
    st.markdown("### 📊 Live Compliance Overview")
    st.caption("Run a scan from **Scan Path** or **Upload & Scan** — results will appear here automatically.")

    if "last_result" not in st.session_state:
        # ── Placeholder stats from rule catalog ──
        rules_all = build_catalog()
        dpdp_count = sum(1 for r in rules_all if r.framework == "DPDP")
        soc2_count = sum(1 for r in rules_all if r.framework == "SOC2")
        high_rules  = sum(1 for r in rules_all if r.severity == "high")

        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Total Rules",   len(rules_all))
        c2.metric("DPDP Rules",    dpdp_count)
        c3.metric("SOC2 Rules",    soc2_count)
        c4.metric("High-Sev Rules", high_rules)

        st.markdown("---")

        # Rule severity breakdown
        st.markdown('<p class="section-header">📐 Rule Catalog Overview</p>', unsafe_allow_html=True)
        rule_df = pd.DataFrame([
            {"Framework": r.framework, "Severity": r.severity, "Category": r.category}
            for r in rules_all
        ])

        col_a, col_b = st.columns(2)
        with col_a:
            sev_df = rule_df["Severity"].value_counts().reset_index()
            sev_df.columns = ["Severity", "Count"]
            colors = [SEVERITY_COLORS.get(s, "#888") for s in sev_df["Severity"]]
            fig = go.Figure(go.Pie(
                labels=sev_df["Severity"].str.capitalize(),
                values=sev_df["Count"],
                marker=dict(colors=colors, line=dict(color="#0f1117", width=2)),
                hole=0.55,
                textinfo="percent+label",
            ))
            fig.update_layout(**PLOTLY_LAYOUT, height=280, showlegend=False,
                              title=dict(text="Rules by Severity", font=dict(color="#e2e8f0", size=14)))
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

        with col_b:
            fw_df = rule_df["Framework"].value_counts().reset_index()
            fw_df.columns = ["Framework", "Count"]
            fig = go.Figure(go.Pie(
                labels=fw_df["Framework"],
                values=fw_df["Count"],
                marker=dict(colors=FRAMEWORK_COLORS, line=dict(color="#0f1117", width=2)),
                hole=0.55,
                textinfo="percent+label",
            ))
            fig.update_layout(**PLOTLY_LAYOUT, height=280, showlegend=False,
                              title=dict(text="Rules by Framework", font=dict(color="#e2e8f0", size=14)))
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

        # Category breakdown (top 12)
        cat_df = rule_df["Category"].value_counts().head(12).reset_index()
        cat_df.columns = ["Category", "Count"]
        cat_df = cat_df.sort_values("Count")
        fig = go.Figure(go.Bar(
            x=cat_df["Count"], y=cat_df["Category"], orientation="h",
            marker=dict(color=cat_df["Count"],
                        colorscale=[[0, "#2e3454"], [0.5, "#6366f1"], [1, "#a78bfa"]]),
            text=cat_df["Count"], textposition="outside",
        ))
        fig.update_layout(**PLOTLY_LAYOUT, height=360,
                          title=dict(text="Rules per Category (top 12)", font=dict(color="#e2e8f0", size=14)),
                          xaxis=dict(showgrid=True, gridcolor="#2e3454"),
                          yaxis=dict(automargin=True))
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

        st.info("💡 Run a scan to see live compliance findings on this dashboard.")

    else:
        process_result(st.session_state["last_result"])


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 1 — SCAN BY PATH
# ═══════════════════════════════════════════════════════════════════════════════
with tabs[1]:
    st.markdown("### 📂 Scan a Local Directory or File")

    col_path, col_fw = st.columns([3, 1])
    with col_path:
        target = st.text_input("Target Path", ".", help="Absolute or relative path to a file or directory")
    with col_fw:
        framework = st.selectbox("Framework", ["ALL", "DPDP", "SOC2"], key="fw_path")

    if st.button("🚀 Run Scan", use_container_width=True, key="btn_scan_path"):
        with st.spinner("Scanning…"):
            result = do_scan(Path(target), framework)
        if result:
            st.session_state["last_result"] = result
            st.success("✅ Scan complete — results saved to Dashboard")
            process_result(result)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 2 — UPLOAD & SCAN
# ═══════════════════════════════════════════════════════════════════════════════
with tabs[2]:
    st.markdown("### ⬆️ Upload Files and Scan")
    st.caption("Upload individual source files **or** a `.zip` archive. They will be extracted to a temporary directory and scanned.")

    col_up, col_fw2 = st.columns([3, 1])
    with col_up:
        uploaded = st.file_uploader(
            "Drop files here",
            accept_multiple_files=True,
            type=["py", "js", "ts", "java", "go", "rb", "php", "cs", "yaml",
                  "yml", "json", "tf", "sh", "env", "txt", "zip"],
            help="Accepts source code, config files, or a ZIP archive",
        )
    with col_fw2:
        framework_up = st.selectbox("Framework", ["ALL", "DPDP", "SOC2"], key="fw_upload")

    if uploaded:
        file_names = [f.name for f in uploaded]
        st.markdown(f"**{len(uploaded)} file(s) selected:** " + ", ".join(f"`{n}`" for n in file_names[:8])
                    + (" …" if len(file_names) > 8 else ""))

    if st.button("🚀 Scan Uploaded Files", use_container_width=True, key="btn_scan_upload"):
        if not uploaded:
            st.warning("⚠️ Please upload at least one file first.")
        else:
            with st.spinner("Preparing and scanning files…"):
                tmp_dir = Path(tempfile.mkdtemp())
                try:
                    for uf in uploaded:
                        dest = tmp_dir / uf.name
                        dest.write_bytes(uf.read())
                        # Auto-extract zip
                        if uf.name.endswith(".zip"):
                            zip_out = tmp_dir / (dest.stem + "_extracted")
                            zip_out.mkdir(exist_ok=True)
                            with zipfile.ZipFile(dest, "r") as z:
                                z.extractall(zip_out)
                            dest.unlink()  # remove the zip itself

                    result = do_scan(tmp_dir, framework_up)
                finally:
                    shutil.rmtree(tmp_dir, ignore_errors=True)

            if result:
                st.session_state["last_result"] = result
                st.success("✅ Scan complete — results saved to Dashboard")
                process_result(result)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 3 — RULES CATALOG
# ═══════════════════════════════════════════════════════════════════════════════
with tabs[3]:
    st.markdown("### 📜 Compliance Rules Catalog")

    rules_all = build_catalog()
    rules_df = pd.DataFrame([
        {
            "Rule #":    r.number,
            "Framework": r.framework,
            "Category":  r.category,
            "Severity":  r.severity,
            "Mode":      r.mode,
            "Title":     r.title,
        }
        for r in rules_all
    ])

    # ── Filters ──
    fc1, fc2, fc3 = st.columns(3)
    with fc1:
        fw_filter = st.multiselect("Framework", rules_df["Framework"].unique().tolist(),
                                   default=rules_df["Framework"].unique().tolist())
    with fc2:
        sv_filter = st.multiselect("Severity", ["high", "medium", "low"],
                                   default=["high", "medium", "low"])
    with fc3:
        cat_filter = st.multiselect("Category", sorted(rules_df["Category"].unique().tolist()),
                                    default=[])

    mask = rules_df["Framework"].isin(fw_filter) & rules_df["Severity"].isin(sv_filter)
    if cat_filter:
        mask &= rules_df["Category"].isin(cat_filter)
    filtered_rules = rules_df[mask]

    st.caption(f"Showing **{len(filtered_rules)}** of **{len(rules_df)}** rules")

    # ── Summary mini-charts ──
    mc1, mc2 = st.columns(2)
    with mc1:
        sv_cnt = filtered_rules["Severity"].value_counts().reset_index()
        sv_cnt.columns = ["Severity", "Count"]
        colors = [SEVERITY_COLORS.get(s, "#888") for s in sv_cnt["Severity"]]
        fig = go.Figure(go.Bar(
            x=sv_cnt["Severity"].str.capitalize(), y=sv_cnt["Count"],
            marker=dict(color=colors), text=sv_cnt["Count"], textposition="outside",
        ))
        fig.update_layout(**PLOTLY_LAYOUT, height=200,
                          xaxis=dict(showgrid=False), yaxis=dict(showgrid=True, gridcolor="#2e3454"))
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
    with mc2:
        fw_cnt = filtered_rules["Framework"].value_counts().reset_index()
        fw_cnt.columns = ["Framework", "Count"]
        fig = go.Figure(go.Bar(
            x=fw_cnt["Framework"], y=fw_cnt["Count"],
            marker=dict(color=FRAMEWORK_COLORS[:len(fw_cnt)]),
            text=fw_cnt["Count"], textposition="outside",
        ))
        fig.update_layout(**PLOTLY_LAYOUT, height=200,
                          xaxis=dict(showgrid=False), yaxis=dict(showgrid=True, gridcolor="#2e3454"))
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    st.dataframe(filtered_rules, use_container_width=True, height=400)


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 4 — GENERATE
# ═══════════════════════════════════════════════════════════════════════════════
with tabs[4]:
    st.markdown("### ⚙️ Generate Rule File")
    st.caption(f"Writes **{RULE_FILE_NAME}** to disk — required before running a scan.")

    col_g1, col_g2 = st.columns([2, 1])
    with col_g1:
        out_path = st.text_input("Output filename", RULE_FILE_NAME)
    with col_g2:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("⚙️ Generate Rules File", use_container_width=True):
            write_rule_file(Path(out_path))
            st.success(f"✅ Rule file written to `{out_path}`")
            count = len(build_catalog())
            st.metric("Rules Generated", count)