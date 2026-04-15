"use client";

import { useState } from "react";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    reference: "",
    objet: "",
    expediteur: "",
    destinataire: "",
    type: "Entrant",
    statut: "En cours",
  });

  const stats = [
    { title: "Courriers entrants", value: "128", subtitle: "Ce mois-ci" },
    { title: "Courriers sortants", value: "64", subtitle: "Ce mois-ci" },
    { title: "En attente", value: "17", subtitle: "À traiter" },
    { title: "Traités", value: "92%", subtitle: "Taux global" },
  ];

  const recentCourriers = [
    {
      reference: "ARR-2026-001",
      objet: "Demande de matériel informatique",
      service: "Service Informatique",
      statut: "En cours",
    },
    {
      reference: "DEP-2026-014",
      objet: "Réponse administrative",
      service: "Ressources humaines",
      statut: "Traité",
    },
    {
      reference: "ENT-2026-020",
      objet: "Transmission de dossier",
      service: "Greffe",
      statut: "En attente",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/courriers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du courrier.");
      }

      alert("Courrier ajouté avec succès ✅");
      setForm({
        reference: "",
        objet: "",
        expediteur: "",
        destinataire: "",
        type: "Entrant",
        statut: "En cours",
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue ❌");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white xl:block">
          <div className="px-6 py-8">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                Smart Courrier
              </p>
              <h2 className="mt-2 text-2xl font-bold">Administration</h2>
            </div>

            <nav className="space-y-2">
              <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white">
                Tableau de bord
              </button>
              <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                Courriers entrants
              </button>
              <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                Courriers sortants
              </button>
              <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                Recherche
              </button>
              <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                Notifications
              </button>
              <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                Paramètres
              </button>
            </nav>
          </div>
        </aside>

        <section className="flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
              <div>
                <p className="text-sm text-slate-500">Bienvenue</p>
                <h1 className="text-3xl font-bold tracking-tight">
                  Tableau de bord
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Recherche avancée
                </button>
                <button
                  onClick={() => setIsOpen(true)}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Nouveau courrier
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>
                  <p className="mt-4 text-4xl font-bold tracking-tight">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{item.subtitle}</p>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-8 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Courriers récents</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Aperçu rapide des derniers mouvements.
                      </p>
                    </div>
                    <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      Voir tout
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                            Référence
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                            Objet
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                            Service
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {recentCourriers.map((courrier) => (
                          <tr key={courrier.reference}>
                            <td className="px-4 py-4 text-sm font-medium text-slate-800">
                              {courrier.reference}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {courrier.objet}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {courrier.service}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  courrier.statut === "Traité"
                                    ? "bg-green-100 text-green-700"
                                    : courrier.statut === "En cours"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {courrier.statut}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold">Actions rapides</h2>
                  <div className="mt-4 space-y-3">
                    {[
                      "Ajouter un courrier",
                      "Consulter les entrants",
                      "Consulter les sortants",
                      "Rechercher un courrier",
                    ].map((action) => (
                      <button
                        key={action}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-slate-900 p-6 text-white shadow-sm">
                  <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
                    AI Ready
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">
                    Une base prête pour l’IA
                  </h2>
                  <p className="mt-3 text-sm text-blue-100">
                    Plus tard, tu pourras intégrer le classement automatique,
                    le résumé de courrier, l’extraction PDF, et les
                    notifications intelligentes.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Ajouter un courrier</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Remplissez les informations du courrier.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Référence
                </label>
                <input
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="REF-2026-001"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                >
                  <option value="Entrant">Entrant</option>
                  <option value="Sortant">Sortant</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Objet
                </label>
                <input
                  name="objet"
                  value={form.objet}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="Objet du courrier"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expéditeur
                </label>
                <input
                  name="expediteur"
                  value={form.expediteur}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="Tribunal de Safi"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Destinataire
                </label>
                <input
                  name="destinataire"
                  value={form.destinataire}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="Service Informatique"
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Statut
                </label>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                >
                  <option value="En cours">En cours</option>
                  <option value="Traité">Traité</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>

              <div className="md:col-span-2 mt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}