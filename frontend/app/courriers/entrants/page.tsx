"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Courrier = {
  id: number;
  reference: string;
  objet: string;
  expediteur: string;
  destinataire?: string;
  type: string;
  statut: string;
  stakeholderId?: number | null;
  dateLimiteReponse?: string | null;
  createdAt: string;
};

export default function CourriersEntrantsPage() {
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(null);

  useEffect(() => {
    const fetchCourriers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/courriers");
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des courriers");
        }
        const data: Courrier[] = await res.json();
        setCourriers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourriers();
  }, []);

  const entrants = useMemo(() => {
    const q = search.toLowerCase();

    return courriers
      .filter((courrier) => courrier.type === "Entrant")
      .filter((courrier) => {
        return (
          courrier.reference.toLowerCase().includes(q) ||
          courrier.objet.toLowerCase().includes(q) ||
          courrier.expediteur.toLowerCase().includes(q) ||
          (courrier.destinataire || "").toLowerCase().includes(q) ||
          courrier.statut.toLowerCase().includes(q)
        );
      });
  }, [courriers, search]);

  const totalEntrants = entrants.length;
  const totalEnCours = entrants.filter((c) => c.statut === "En cours").length;
  const totalTraites = entrants.filter((c) => c.statut === "Traité").length;
  const totalExpires = entrants.filter((c) => {
    if (!c.dateLimiteReponse || c.statut === "Traité") return false;
    return new Date(c.dateLimiteReponse) < new Date();
  }).length;

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              Gestion des courriers
            </p>
            <h1 className="mt-2 text-3xl font-bold">Courriers entrants</h1>
            <p className="mt-2 text-sm text-slate-500">
              Liste complète des courriers entrants.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Retour au tableau de bord
            </Link>
            <Link
              href="/courriers/sortants"
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Voir les sortants
            </Link>
          </div>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total entrants</p>
            <p className="mt-3 text-3xl font-bold">{totalEntrants}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">En cours</p>
            <p className="mt-3 text-3xl font-bold">{totalEnCours}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Traités</p>
            <p className="mt-3 text-3xl font-bold">{totalTraites}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Expirés</p>
            <p className="mt-3 text-3xl font-bold">{totalExpires}</p>
          </div>
        </section>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold">Liste des courriers entrants</h2>

            <input
              type="text"
              placeholder="Rechercher par référence, objet, expéditeur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none md:max-w-md"
            />
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
                    Expéditeur
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Date limite
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                      Chargement...
                    </td>
                  </tr>
                ) : entrants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                      Aucun courrier entrant trouvé.
                    </td>
                  </tr>
                ) : (
                  entrants.map((courrier) => (
                    <tr
                      key={courrier.id}
                      onClick={() => setSelectedCourrier(courrier)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-slate-800">
                        {courrier.reference}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {courrier.objet}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {courrier.expediteur}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {courrier.dateLimiteReponse || "—"}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCourrier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedCourrier(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Détails du courrier entrant</h2>
              <button
                onClick={() => setSelectedCourrier(null)}
                className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Référence</p>
                <p className="font-medium">{selectedCourrier.reference}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Type</p>
                <p className="font-medium">{selectedCourrier.type}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-slate-500">Objet</p>
                <p className="font-medium">{selectedCourrier.objet}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Expéditeur</p>
                <p className="font-medium">{selectedCourrier.expediteur}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Destinataire</p>
                <p className="font-medium">{selectedCourrier.destinataire || "—"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Statut</p>
                <p className="font-medium">{selectedCourrier.statut}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Date limite</p>
                <p className="font-medium">
                  {selectedCourrier.dateLimiteReponse || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Créé le</p>
                <p className="font-medium">
                  {new Date(selectedCourrier.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}