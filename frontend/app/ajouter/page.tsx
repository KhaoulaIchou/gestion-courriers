"use client";

import { useState } from "react";

export default function AjouterCourrier() {
  const [form, setForm] = useState({
    reference: "",
    objet: "",
    expediteur: "",
    destinataire: "",
    type: "Entrant",
    statut: "En cours",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/courriers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Courrier ajouté avec succès ✅");
      setForm({
        reference: "",
        objet: "",
        expediteur: "",
        destinataire: "",
        type: "Entrant",
        statut: "En cours",
      });
    } else {
      alert("Erreur ❌");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">Ajouter un courrier</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="reference"
            placeholder="Référence"
            value={form.reference}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            name="objet"
            placeholder="Objet"
            value={form.objet}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            name="expediteur"
            placeholder="Expéditeur"
            value={form.expediteur}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            name="destinataire"
            placeholder="Destinataire"
            value={form.destinataire}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >
            <option value="Entrant">Entrant</option>
            <option value="Sortant">Sortant</option>
          </select>

          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >
            <option value="En cours">En cours</option>
            <option value="Traité">Traité</option>
            <option value="En attente">En attente</option>
          </select>

          <button className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700">
            Enregistrer
          </button>
        </form>
      </div>
    </main>
  );
}