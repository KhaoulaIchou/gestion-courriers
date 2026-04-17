"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";

type Courrier = {
  id: number;
  reference: string;
  objet: string;
  expediteur: string;
  destinataire?: string;
  type: string;
  statut: string;
  dateLimiteReponse?: string | null;
  createdAt: string;
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
};

type CourrierForm = {
  reference: string;
  objet: string;
  expediteur: string;
  destinataire: string;
  type: string;
  statut: string;
};

const initialForm: CourrierForm = {
  reference: "",
  objet: "",
  expediteur: "",
  destinataire: "",
  type: "Entrant",
  statut: "En cours",
};

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
  reference: "",
  objet: "",
  expediteur: "",
  destinataire: "",
  type: "Entrant",
  statut: "En cours",
  dateLimiteReponse: "",
});

  const fetchCourriers = useCallback(async () => {
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
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/notifications");
      if (!res.ok) {
        throw new Error("Erreur lors du chargement des notifications");
      }
      const data: NotificationItem[] = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCourriers();
    fetchNotifications();
  }, [fetchCourriers, fetchNotifications]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        throw new Error("Erreur lors de l'ajout du courrier");
      }

      setForm({
        reference: "",
        objet: "",
        expediteur: "",
        destinataire: "",
        type: "Entrant",
        statut: "En cours",
        dateLimiteReponse: "",
      });
      setIsOpen(false);

      await fetchCourriers();
      await fetchNotifications();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    }
  };

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const totalEntrants = courriers.filter((c) => c.type === "Entrant").length;
  const totalSortants = courriers.filter((c) => c.type === "Sortant").length;
  const totalEnCours = courriers.filter((c) => c.statut === "En cours").length;
  const totalTraites = courriers.filter((c) => c.statut === "Traité").length;

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
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
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
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  aria-label="Ouvrir les notifications"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

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
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Courriers entrants
                </p>
                <p className="mt-4 text-4xl font-bold tracking-tight">
                  {totalEntrants}
                </p>
                <p className="mt-2 text-sm text-slate-400">Depuis la base</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Courriers sortants
                </p>
                <p className="mt-4 text-4xl font-bold tracking-tight">
                  {totalSortants}
                </p>
                <p className="mt-2 text-sm text-slate-400">Depuis la base</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">En cours</p>
                <p className="mt-4 text-4xl font-bold tracking-tight">
                  {totalEnCours}
                </p>
                <p className="mt-2 text-sm text-slate-400">À traiter</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Traités</p>
                <p className="mt-4 text-4xl font-bold tracking-tight">
                  {totalTraites}
                </p>
                <p className="mt-2 text-sm text-slate-400">Statut traité</p>
              </div>
            </section>

            <section className="mt-8 grid gap-8 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Courriers récents</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Données réelles depuis PostgreSQL.
                      </p>
                    </div>
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
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                            Statut
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 bg-white">
                        {loading ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-6 text-center text-sm text-slate-500"
                            >
                              Chargement...
                            </td>
                          </tr>
                        ) : courriers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-6 text-center text-sm text-slate-500"
                            >
                              Aucun courrier trouvé.
                            </td>
                          </tr>
                        ) : (
                          courriers.slice(0, 8).map((courrier) => (
                            <tr key={courrier.id}>
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
                                {courrier.type}
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

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold">Actions rapides</h2>
                  <div className="mt-4 space-y-3">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Ajouter un courrier
                    </button>
                    <button className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                      Consulter les entrants
                    </button>
                    <button className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                      Consulter les sortants
                    </button>
                    <button className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                      Rechercher un courrier
                    </button>
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
                    Classification automatique, résumé, extraction PDF et
                    recherche intelligente.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Référence
                </label>
                <input
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="REF-2026-001"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
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
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Objet du courrier"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expéditeur
                </label>
                <input
                  name="expediteur"
                  value={form.expediteur}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Tribunal de Safi"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Destinataire
                </label>
                <input
                  name="destinataire"
                  value={form.destinataire}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Service Informatique"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Statut
                </label>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="En cours">En cours</option>
                  <option value="Traité">Traité</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>
              <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date limite de réponse
              </label>
              <input
                type="date"
                name="dateLimiteReponse"
                value={form.dateLimiteReponse}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

              <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
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

      {isNotificationsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsNotificationsOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Notifications</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Historique des événements récents.
                </p>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500">
                  Aucune notification.
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                      className={`rounded-2xl border p-4 ${
                        notification.type === "danger"
                          ? "border-red-200 bg-red-50"
                          : notification.type === "warning"
                            ? "border-amber-200 bg-amber-50"
                            : notification.isRead
                              ? "border-slate-200 bg-slate-50"
                              : "border-blue-200 bg-blue-50"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold text-white ${
                            notification.type === "danger"
                              ? "bg-red-600"
                              : notification.type === "warning"
                                ? "bg-amber-500"
                                : "bg-blue-600"
                          }`}
                        >
                          {notification.type === "danger"
                            ? "Expiré"
                            : notification.type === "warning"
                              ? "Rappel"
                              : "Nouveau"}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}