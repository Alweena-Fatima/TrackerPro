import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar as ReBar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

// Single-file React prototype. TailwindCSS assumed configured in parent project.
// NPM deps used: recharts, jspdf, framer-motion

const defaultForm = {
  patientId: "P-0001",
  age: 56,
  sex: "Female",
  surgeryType: "Colorectal",
  urgency: "Elective",
  labs: {
    lactate: 1.1,
    albumin: 3.8,
    crp: 8,
    bun: 15,
    creatinine: 0.9,
  },
  intra: {
    ebl: 250,
    rbc: 0,
    surgeryTime: 180,
    anesthesiaTime: 200,
    fluids: 1500,
  },
  postop: {
    urine: 120,
    vasopressors: false,
    postLactate: 1.2,
  },
};

function useLocalDB(key = "postop-db") {
  const save = (record) => {
    const db = JSON.parse(localStorage.getItem(key) || "[]");
    db.unshift(record);
    localStorage.setItem(key, JSON.stringify(db.slice(0, 200)));
  };
  const list = () => JSON.parse(localStorage.getItem(key) || "[]");
  return { save, list };
}

function App() {
  const [screen, setScreen] = useState("home");
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const db = useLocalDB();

  const validate = (f) => {
    const e = {};
    if (!f.patientId) e.patientId = "Required";
    if (!f.age || f.age <= 0) e.age = "Enter valid age";
    if (!f.labs || f.labs.albumin === undefined) e.labs = "Provide labs";
    return e;
  };

  const handleChange = (path, value) => {
    const parts = path.split(".");
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let node = copy;
      for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]];
      node[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const runAnalysis = () => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setScreen("analysis");
    setTimeout(() => {
      // simple synthetic scoring to produce phenotype and numeric LOS
      const { labs, intra } = form;
      const score = (labs.lactate || 0) * 2 + (intra.ebl || 0) / 500 + (labs.albumin ? Math.max(0, 4 - labs.albumin) : 0) * 2 + (form.age / 100);
      let phenotype = "A";
      let conf = 0.6;
      if (score > 3.5) { phenotype = "C"; conf = 0.82; }
      else if (score > 2.0) { phenotype = "B"; conf = 0.72; }
      else { phenotype = "A"; conf = 0.68; }

      // ICU probability (0-1)
      const icuProb = Math.min(0.99, 0.2 + score * 0.15);
      // derive a numeric Length of Stay (days) from score (demo rule)
      const losDays = Math.max(1, Math.round(score * 2));

      const risks = {
        icu: icuProb,
        losDays,
      };

      const shap = [
        { name: "Lactate", value: (labs.lactate || 0) * 1.8 },
        { name: "EBL", value: (intra.ebl || 0) / 200 },
        { name: "Anesthesia Time", value: (intra.anesthesiaTime || 0) / 120 },
        { name: "Albumin (low)", value: Math.max(0, (3.8 - (labs.albumin || 3.8))) * 2.2 },
        { name: "CRP/Alb", value: ((labs.crp || 0) / Math.max(0.1, labs.albumin || 3.8)) / 4 },
      ];

      const clusterAvg = {
        lactate: 1.1,
        ebl: 250,
        albumin: 3.8,
        surgeryTime: 180,
      };

      const res = { phenotype, conf: Math.round(conf * 100), risks, shap, clusterAvg };
      setResult(res);
      setLoading(false);
      setScreen("result");
    }, 700);
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text("PostOp Persona — Patient Recovery Report", 40, 60);
    doc.setFontSize(11);
    doc.text(`Patient ID: ${form.patientId}`, 40, 90);
    doc.text(`Phenotype: ${result.phenotype}  (Confidence ${result.conf}%)`, 40, 110);
    doc.text(`ICU Need Probability: ${result.risks.icu.toFixed(2)}`, 40, 130);
    doc.text(`Length of Stay (days): ${result.risks.losDays}`, 40, 150);
    doc.text("Top contributors:", 40, 180);
    result.shap.slice(0,5).forEach((s, i) => {
      doc.text(`${i+1}. ${s.name} — ${s.value.toFixed(2)}`, 60, 200 + i*16);
    });
    doc.save(`${form.patientId}_postop_report.pdf`);
  };

  const saveToDB = () => {
    if (!result) return;
    db.save({ id: form.patientId, timestamp: new Date().toISOString(), form, result });
    alert("Saved to local database (localStorage)");
  };

  const loadPrevious = () => setScreen("previous");

  const renderHome = () => (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">PostOp Persona – Clinical Decision Support</h1>
        <p className="text-sm text-gray-500">Prototype clinical DSS — recovery phenotype & risk interpretation</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg border shadow-sm">
          <h3 className="font-medium">New Patient Analysis</h3>
          <p className="text-sm text-gray-500">Start a structured assessment for a patient.</p>
        </div>
        <div className="p-4 rounded-lg border shadow-sm">
          <h3 className="font-medium">View Previous Reports</h3>
          <p className="text-sm text-gray-500">Browse saved analyses (local demo DB).</p>
        </div>
        <div className="p-4 rounded-lg border shadow-sm">
          <h3 className="font-medium">About the Recovery Phenotypes (A, B, C)</h3>
          <p className="text-sm text-gray-500">Short descriptions of each cluster and clinical implications.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setScreen("input")} className="px-4 py-2 bg-blue-600 text-white rounded">Start Analysis</button>
        <button onClick={loadPrevious} className="px-4 py-2 border rounded">View Previous Reports</button>
      </div>
    </div>
  );

  const renderInput = () => (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patient Data Input</h2>
        <div className="flex gap-2">
          <button onClick={() => setScreen("home")} className="px-3 py-1 border rounded">Home</button>
          <button onClick={() => setScreen("previous")} className="px-3 py-1 border rounded">Saved</button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <section className="mb-4">
          <h3 className="font-medium">Section A: Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
            <div>
              <label className="text-sm">Patient ID</label>
              <input value={form.patientId} onChange={(e)=>setForm({...form,patientId:e.target.value})} className="w-full border p-2 rounded" />
              {errors.patientId && <div className="text-xs text-red-500">{errors.patientId}</div>}
            </div>
            <div>
              <label className="text-sm">Age</label>
              <input type="number" value={form.age} onChange={(e)=>setForm({...form,age:Number(e.target.value)})} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="text-sm">Sex</label>
              <select value={form.sex} onChange={(e)=>setForm({...form,sex:e.target.value})} className="w-full border p-2 rounded">
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Surgery Type</label>
              <select value={form.surgeryType} onChange={(e)=>setForm({...form,surgeryType:e.target.value})} className="w-full border p-2 rounded">
                <option>Colorectal</option>
                <option>Cardiac</option>
                <option>Orthopaedic</option>
                <option>Hepatobiliary</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm">Urgency</label>
            <select value={form.urgency} onChange={(e)=>setForm({...form,urgency:e.target.value})} className="w-48 border p-2 rounded">
              <option>Elective</option>
              <option>Emergency</option>
            </select>
          </div>
        </section>

        <section className="mb-4">
          <h3 className="font-medium">Section B: Pre-op & Intra-op Labs</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-600">
                <tr>
                  <th className="py-2">Feature</th>
                  <th>Entry</th>
                  <th>Unit</th>
                  <th>Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lactate</td>
                  <td><input type="number" step="0.1" value={form.labs.lactate} onChange={(e)=>handleChange('labs.lactate', Number(e.target.value))} className="border p-1 rounded w-28"/></td>
                  <td>mmol/L</td>
                  <td className="text-gray-400">0.5–2.2</td>
                </tr>
                <tr>
                  <td>Albumin</td>
                  <td><input type="number" step="0.1" value={form.labs.albumin} onChange={(e)=>handleChange('labs.albumin', Number(e.target.value))} className="border p-1 rounded w-28"/></td>
                  <td>g/dL</td>
                  <td className="text-gray-400">3.5–5.5</td>
                </tr>
                <tr>
                  <td>CRP</td>
                  <td><input type="number" step="0.1" value={form.labs.crp} onChange={(e)=>handleChange('labs.crp', Number(e.target.value))} className="border p-1 rounded w-28"/></td>
                  <td>mg/L</td>
                  <td className="text-gray-400">&lt;10</td>
                </tr>
                <tr>
                  <td>BUN</td>
                  <td><input type="number" step="0.1" value={form.labs.bun} onChange={(e)=>handleChange('labs.bun', Number(e.target.value))} className="border p-1 rounded w-28"/></td>
                  <td>mg/dL</td>
                  <td className="text-gray-400">7–20</td>
                </tr>
                <tr>
                  <td>Creatinine</td>
                  <td><input type="number" step="0.01" value={form.labs.creatinine} onChange={(e)=>handleChange('labs.creatinine', Number(e.target.value))} className="border p-1 rounded w-28"/></td>
                  <td>mg/dL</td>
                  <td className="text-gray-400">0.6–1.3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-4">
          <h3 className="font-medium">Section C: Intra-operative Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Estimated Blood Loss</label>
              <input type="number" value={form.intra.ebl} onChange={(e)=>handleChange('intra.ebl', Number(e.target.value))} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">RBC Transfusion (Units)</label>
              <input type="number" value={form.intra.rbc} onChange={(e)=>handleChange('intra.rbc', Number(e.target.value))} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Surgery Duration (min)</label>
              <input type="number" value={form.intra.surgeryTime} onChange={(e)=>handleChange('intra.surgeryTime', Number(e.target.value))} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Anesthesia Time (min)</label>
              <input type="number" value={form.intra.anesthesiaTime} onChange={(e)=>handleChange('intra.anesthesiaTime', Number(e.target.value))} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Total Fluids (mL)</label>
              <input type="number" value={form.intra.fluids} onChange={(e)=>handleChange('intra.fluids', Number(e.target.value))} className="border p-2 rounded w-full" />
            </div>
          </div>
        </section>

        <section className="mb-4">
          <h3 className="font-medium">Section D: Early Post-op Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Urine Output (mL)</label>
              <input type="number" value={form.postop.urine} onChange={(e)=>handleChange('postop.urine', Number(e.target.value))} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Vasopressor Use</label>
              <select value={form.postop.vasopressors ? 'Yes' : 'No'} onChange={(e)=>handleChange('postop.vasopressors', e.target.value === 'Yes')} className="border p-2 rounded w-full">
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Post-op Lactate</label>
              <input type="number" step="0.1" value={form.postop.postLactate} onChange={(e)=>handleChange('postop.postLactate', Number(e.target.value))} className="border p-2 rounded w-full" />
            </div>
          </div>
        </section>

        <div className="mt-4 flex justify-end">
          <button onClick={runAnalysis} className="px-4 py-2 bg-green-600 text-white rounded">Analyze Patient Profile</button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-green-500 animate-spin"></div>
              <div>
                <div className="font-medium">Generating recovery phenotype and risk interpretation…</div>
                <div className="text-sm text-gray-500">This is a demo. Model outputs are synthetic.</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  const renderResult = () => {
    // wrap returned JSX in a fragment to avoid adjacent elements error
    return (
      <>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Phenotype Result</h2>
            <div className="flex gap-2">
              <button onClick={()=>setScreen('input')} className="px-3 py-1 border rounded">Edit Data</button>
              <button onClick={()=>setScreen('home')} className="px-3 py-1 border rounded">Home</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2 p-4 rounded border shadow-sm bg-white">
              <h3 className="text-lg font-medium">Predicted Recovery Phenotype</h3>
              <div className="mt-3 flex items-center gap-4">
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <div className="text-2xl font-bold">{result.phenotype === 'C' ? 'High Risk Phenotype' : 'Low Risk Phenotype'}</div>
                  <div className="text-sm text-gray-600">Confidence: {result.conf}%</div>
                  <div className="mt-2 text-sm text-gray-700">Higher metabolic stress and higher blood loss patterns.</div>
                </div>

                <div className="p-4 rounded-lg border flex-1">
                  <div className="text-sm font-medium">Risk Summary</div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center">
                      <div>ICU Need Probability</div>
                      <div className="font-semibold">{result.risks.icu.toFixed(2)}</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>Length of Stay (days)</div>
                      <div className="font-semibold">{result.risks.losDays}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded border bg-white">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="mt-2 flex flex-col gap-2">
                <button onClick={()=>setScreen('explain')} className="px-3 py-2 bg-blue-600 text-white rounded">View Explainability</button>
                <button onClick={()=>setScreen('report')} className="px-3 py-2 bg-green-600 text-white rounded">Generate Report</button>
                <button onClick={saveToDB} className="px-3 py-2 border rounded">Save to Database</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderExplain = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Explanation Panel</h2>
        <div className="flex gap-2">
          <button onClick={()=>setScreen('result')} className="px-3 py-1 border rounded">Back</button>
          <button onClick={()=>setScreen('home')} className="px-3 py-1 border rounded">Home</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded border bg-white">
          <h3 className="font-medium">A. SHAP Bar Graph (Top contributors)</h3>
          <div style={{ height: 260 }} className="mt-3">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={result.shap} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={160} />
                <Tooltip />
                <ReBar dataKey="value" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 rounded border bg-white">
          <h3 className="font-medium">B. Comparison to Cluster Norms</h3>
          <table className="w-full text-sm mt-3">
            <thead className="text-left text-gray-600">
              <tr><th>Feature</th><th>Patient</th><th>Cluster Avg</th><th>Comment</th></tr>
            </thead>
            <tbody>
              <tr><td>Lactate</td><td>{form.labs.lactate}</td><td>{result.clusterAvg.lactate}</td><td className="text-red-600">{form.labs.lactate > result.clusterAvg.lactate ? 'Higher' : 'Normal'}</td></tr>
              <tr><td>EBL</td><td>{form.intra.ebl} mL</td><td>{result.clusterAvg.ebl} mL</td><td className="text-red-600">{form.intra.ebl > result.clusterAvg.ebl ? 'Very High' : 'Normal'}</td></tr>
              <tr><td>Albumin</td><td>{form.labs.albumin}</td><td>{result.clusterAvg.albumin}</td><td className="text-red-600">{form.labs.albumin < result.clusterAvg.albumin ? 'Low' : 'Normal'}</td></tr>
              <tr><td>Surgery Time</td><td>{(form.intra.surgeryTime/60).toFixed(1)} hrs</td><td>{(result.clusterAvg.surgeryTime/60).toFixed(1)} hrs</td><td className="text-red-600">{form.intra.surgeryTime > result.clusterAvg.surgeryTime ? 'Longer' : 'Normal'}</td></tr>
            </tbody>
          </table>

          <div className="mt-4">
            <h4 className="font-medium">C. Text Summary</h4>
            <p className="text-sm text-gray-700 mt-2">The patient matches Cluster {result.phenotype} due to elevated lactate, long surgery, high blood loss, and reduced albumin. These factors align with the “metabolically stressed” recovery pattern.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Generate Report</h2>
        <div className="flex gap-2">
          <button onClick={()=>setScreen('result')} className="px-3 py-1 border rounded">Back</button>
          <button onClick={()=>setScreen('home')} className="px-3 py-1 border rounded">Home</button>
        </div>
      </div>

      <div className="p-4 border rounded bg-white">
        <div className="mb-4">
          <strong>Preview</strong>
          <div className="mt-2 p-3 border rounded">
            <div>Patient ID: {form.patientId}</div>
            <div>Recovery Phenotype: {result.phenotype} ({result.conf}%)</div>
            <div className="mt-2">Top SHAP contributors:</div>
            <ul className="list-disc pl-6">
              {result.shap.slice(0,4).map((s,i)=> <li key={i}>{s.name} — {s.value.toFixed(2)}</li>)}
            </ul>
            <div className="mt-2">Risk scores: ICU {result.risks.icu.toFixed(2)}, LOS (days) {result.risks.losDays}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={downloadPDF} className="px-3 py-2 bg-blue-600 text-white rounded">Download PDF Report</button>
          <button onClick={saveToDB} className="px-3 py-2 border rounded">Save to Database</button>
          <button onClick={()=>{ setForm(defaultForm); setResult(null); setScreen('input'); }} className="px-3 py-2 border rounded">Start New Analysis</button>
        </div>
      </div>
    </div>
  );

  const renderPrevious = () => {
    const items = db.list();
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Saved Analyses</h2>
          <div className="flex gap-2">
            <button onClick={()=>setScreen('home')} className="px-3 py-1 border rounded">Home</button>
          </div>
        </div>
        <div className="bg-white rounded border p-4">
          {items.length === 0 && <div className="text-gray-500">No saved reports yet.</div>}
          {items.length > 0 && (
            <table className="w-full text-sm">
              <thead className="text-left text-gray-600"><tr><th>ID</th><th>Date</th><th>Phenotype</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it, idx)=> (
                  <tr key={idx} className="border-t">
                    <td>{it.id}</td>
                    <td>{new Date(it.timestamp).toLocaleString()}</td>
                    <td>{it.result.phenotype}</td>
                    <td>
                      <button onClick={()=>{ setForm(it.form); setResult(it.result); setScreen('result'); }} className="px-2 py-1 border rounded mr-2">Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'home' && renderHome()}
      {screen === 'input' && renderInput()}
      {screen === 'analysis' && (
        <div className="p-6 text-center">Analyzing… (please wait)</div>
      )}
      {screen === 'result' && result && renderResult()}
      {screen === 'explain' && result && renderExplain()}
      {screen === 'report' && result && renderReport()}
      {screen === 'previous' && renderPrevious()}
    </div>
  );
}
export default App;
