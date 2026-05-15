"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
};

type Stakeholder = {
  id: number;
  nom: string;
  categorie: string;
  entiteParent?: string | null;
  ville?: string | null;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  isActive: boolean;
  createdAt: string;
};

type CourrierForm = {
  reference: string;
  objet: string;
  expediteur: string;
  destinataire: string;
  type: string;
  statut: string;
  stakeholderId: string;
  dateLimiteReponse: string;
};

type StakeholderForm = {
  nom: string;
  categorie: string;
  entiteParent: string;
  ville: string;
  email: string;
  telephone: string;
  adresse: string;
};

const stakeholderTypes = [
  { value: "tribunal", label: "Tribunal" },
  { value: "centre_juge_resident", label: "Centre de juge résident" },
  { value: "direction_centrale", label: "Direction centrale" },
  {
    value: "service_direction_centrale",
    label: "Service de direction centrale",
  },
  { value: "direction_provinciale", label: "Direction provinciale" },
  {
    value: "service_direction_provinciale",
    label: "Service de direction provinciale",
  },
  { value: "particulier", label: "Particulier" },
  { value: "societe", label: "Société" },
  { value: "autre", label: "Autre" },
];

const DEFAULT_DIRECTION_PROVINCIALE =
  "Direction provinciale de justice de Safi";

const INTERNAL_SERVICE_LABEL =
  "Service de l’équipement, de la gestion des biens et des systèmes d’information";

const initialCourrierForm: CourrierForm = {
  reference: "",
  objet: "",
  expediteur: "",
  destinataire: INTERNAL_SERVICE_LABEL,
  type: "Entrant",
  statut: "En cours",
  stakeholderId: "",
  dateLimiteReponse: "",
};

const initialStakeholderForm: StakeholderForm = {
  nom: "",
  categorie: "",
  entiteParent: "",
  ville: "",
  email: "",
  telephone: "",
  adresse: "",
};

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [isStakeholderTypeOpen, setIsStakeholderTypeOpen] = useState(false);
  const [isStakeholderOpen, setIsStakeholderOpen] = useState(false);
  const [selectedStakeholderCategory, setSelectedStakeholderCategory] =
    useState("");

  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CourrierForm>(initialCourrierForm);
  const [stakeholderForm, setStakeholderForm] =
    useState<StakeholderForm>(initialStakeholderForm);

const fetchCourriers = useCallback(async () => {
  try {
    setLoading(true);
    const res = await fetch("http://localhost:3001/courriers", {
      credentials: "include",
      cache: "no-store",
    });

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
    const res = await fetch("http://localhost:3001/notifications", {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Erreur lors du chargement des notifications");
    }

    const data: NotificationItem[] = await res.json();
    setNotifications(data);
  } catch (error) {
    console.error(error);
  }
}, []);

const fetchStakeholders = useCallback(async () => {
  try {
    const res = await fetch("http://localhost:3001/stakeholders", {
      credentials: "include",
      cache: "no-store",
    });

    console.log("stakeholders status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log("stakeholders response:", errorText);
      throw new Error("Erreur lors du chargement des parties prenantes");
    }

    const data: Stakeholder[] = await res.json();
    setStakeholders(data);
  } catch (error) {
    console.error(error);
  }
}, []);

  useEffect(() => {
    fetchCourriers();
    fetchNotifications();
    fetchStakeholders();
  }, [fetchCourriers, fetchNotifications, fetchStakeholders]);

  const isEntrant = form.type === "Entrant";

  const centralDirections = useMemo(() => {
    return stakeholders.filter(
      (item) => item.categorie === "direction_centrale" && item.isActive,
    );
  }, [stakeholders]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      setForm((prev) => ({
        ...prev,
        type: value,
        stakeholderId: "",
        expediteur: value === "Sortant" ? INTERNAL_SERVICE_LABEL : "",
        destinataire: value === "Entrant" ? INTERNAL_SERVICE_LABEL : "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStakeholderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setStakeholderForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openStakeholderTypePopup = () => {
    setIsStakeholderTypeOpen(true);
  };

  const openStakeholderForm = () => {
    if (!selectedStakeholderCategory) {
      alert("Veuillez sélectionner un type de partie prenante");
      return;
    }

    setStakeholderForm({
      ...initialStakeholderForm,
      categorie: selectedStakeholderCategory,
      entiteParent:
        selectedStakeholderCategory === "service_direction_provinciale"
          ? DEFAULT_DIRECTION_PROVINCIALE
          : "",
    });

    setIsStakeholderTypeOpen(false);
    setIsStakeholderOpen(true);
  };

  const closeStakeholderFlow = () => {
    setIsStakeholderTypeOpen(false);
    setIsStakeholderOpen(false);
    setSelectedStakeholderCategory("");
    setStakeholderForm(initialStakeholderForm);
  };

  const getStakeholderTypeLabel = (value: string) => {
    return (
      stakeholderTypes.find((item) => item.value === value)?.label ||
      "Partie prenante"
    );
  };

  const requiresVille = (category: string) => {
    return (
      category === "tribunal" ||
      category === "centre_juge_resident" ||
      category === "direction_provinciale" ||
      category === "societe"
    );
  };

  const stakeholderOptionLabel = (stakeholder: Stakeholder) => {
    const typeLabel = getStakeholderTypeLabel(stakeholder.categorie);

    if (
      stakeholder.categorie === "direction_provinciale" ||
      stakeholder.categorie === "direction_centrale"
    ) {
      return `${stakeholder.nom} — ${typeLabel}`;
    }

    if (stakeholder.entiteParent) {
      return `${stakeholder.nom} — ${typeLabel} — ${stakeholder.entiteParent}`;
    }

    if (stakeholder.ville) {
      return `${stakeholder.nom} — ${typeLabel} — ${stakeholder.ville}`;
    }

    return `${stakeholder.nom} — ${typeLabel}`;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedStakeholder = stakeholders.find(
        (item) => item.id === Number(form.stakeholderId),
      );

      if (!selectedStakeholder) {
        alert("Veuillez sélectionner une partie prenante.");
        return;
      }

      const finalExpediteur = isEntrant
        ? selectedStakeholder.nom
        : INTERNAL_SERVICE_LABEL;

      const finalDestinataire = isEntrant
        ? INTERNAL_SERVICE_LABEL
        : selectedStakeholder.nom;

      const formData = new FormData();
      formData.append("reference", form.reference);
      formData.append("objet", form.objet);
      formData.append("expediteur", finalExpediteur);
      formData.append("destinataire", finalDestinataire);
      formData.append("type", form.type);
      formData.append("statut", form.statut);
      formData.append("stakeholderId", String(Number(form.stakeholderId)));
      formData.append("dateLimiteReponse", form.dateLimiteReponse || "");

      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const res = await fetch("http://localhost:3001/courriers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du courrier");
      }

      setForm(initialCourrierForm);
      setPdfFile(null);
      setIsOpen(false);

      await fetchCourriers();
      await fetchNotifications();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    }
  };

  const handleStakeholderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/stakeholders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(stakeholderForm),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout de la partie prenante");
      }

      setStakeholderForm(initialStakeholderForm);
      setSelectedStakeholderCategory("");
      setIsStakeholderOpen(false);
      await fetchStakeholders();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de la partie prenante");
    }
  };
  
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;

  if (!file) {
    setPdfFile(null);
    return;
  }

  if (file.type !== "application/pdf") {
    alert("Veuillez sélectionner un fichier PDF.");
    e.target.value = "";
    return;
  }

  setPdfFile(file);
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
              <div className="mb-10 flex justify-center">
                <Image
                  src="/logo-ministere-justice.png"
                  alt="Logo Ministère de la Justice"
                  width={110}
                  height={110}
                  className="h-auto w-auto object-contain"
                  priority
                />
              </div>

            <nav className="space-y-2">
              <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white">
                Tableau de bord
              </button>
              <Link
                href="/courriers/entrants"
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Courriers entrants
              </Link>
              <Link
                href="/courriers/sortants"
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Courriers sortants
              </Link>
              <button className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100">
                Recherche
              </button>
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Notifications
              </button>
              <button
                onClick={openStakeholderTypePopup}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Parties prenantes
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

                <button
                  onClick={openStakeholderTypePopup}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Parties prenantes
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
                <button
                  onClick={async () => {
                    await fetch("http://localhost:3001/auth/logout", {
                      method: "POST",
                      credentials: "include",
                    });
                    window.location.href = "/login";
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Déconnexion
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
                    <button
                      onClick={openStakeholderTypePopup}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Ajouter une partie prenante
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

                {/*<div className="rounded-3xl bg-gradient-to-br from-blue-600 to-slate-900 p-6 text-white shadow-sm">
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
                </div>*/}
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

              {isEntrant ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Expéditeur
                    </label>
                    <select
                      name="stakeholderId"
                      value={form.stakeholderId}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Sélectionner une partie prenante</option>
                      {stakeholders.map((stakeholder) => (
                        <option key={stakeholder.id} value={stakeholder.id}>
                          {stakeholderOptionLabel(stakeholder)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Destinataire
                    </label>
                    <input
                      value={INTERNAL_SERVICE_LABEL}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                      disabled
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Expéditeur
                    </label>
                    <input
                      value={INTERNAL_SERVICE_LABEL}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Destinataire
                    </label>
                    <select
                      name="stakeholderId"
                      value={form.stakeholderId}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Sélectionner une partie prenante</option>
                      {stakeholders.map((stakeholder) => (
                        <option key={stakeholder.id} value={stakeholder.id}>
                          {stakeholderOptionLabel(stakeholder)}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

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
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Fichier PDF
                </label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                />
                {pdfFile && (
                  <p className="mt-2 text-sm text-slate-500">
                    Fichier sélectionné : {pdfFile.name}
                  </p>
                )}
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

      {isStakeholderTypeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsStakeholderTypeOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Choisir le type</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sélectionnez d’abord le type de partie prenante.
                </p>
              </div>
              <button
                onClick={() => setIsStakeholderTypeOpen(false)}
                className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Type de partie prenante
                </label>
                <select
                  value={selectedStakeholderCategory}
                  onChange={(e) => setSelectedStakeholderCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  {stakeholderTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStakeholderTypeOpen(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={openStakeholderForm}
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isStakeholderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeStakeholderFlow}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Ajouter : {getStakeholderTypeLabel(selectedStakeholderCategory)}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Remplissez les informations selon le type choisi.
                </p>
              </div>
              <button
                onClick={closeStakeholderFlow}
                className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleStakeholderSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nom
                </label>
                <input
                  name="nom"
                  value={stakeholderForm.nom}
                  onChange={handleStakeholderChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Nom de la partie prenante"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Catégorie
                </label>
                <input
                  value={getStakeholderTypeLabel(selectedStakeholderCategory)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
                  disabled
                />
              </div>

              {selectedStakeholderCategory ===
                "service_direction_provinciale" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Entité parente
                  </label>
                  <input
                    name="entiteParent"
                    value={stakeholderForm.entiteParent}
                    onChange={handleStakeholderChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                    readOnly
                  />
                </div>
              )}

              {selectedStakeholderCategory === "service_direction_centrale" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Entité parente
                  </label>
                  <select
                    name="entiteParent"
                    value={stakeholderForm.entiteParent}
                    onChange={handleStakeholderChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner une direction centrale</option>
                    {centralDirections.map((item) => (
                      <option key={item.id} value={item.nom}>
                        {item.nom}
                      </option>
                    ))}
                  </select>

                  {centralDirections.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      Ajoutez d’abord une direction centrale pour pouvoir la
                      sélectionner ici.
                    </p>
                  )}
                </div>
              )}

              {requiresVille(selectedStakeholderCategory) && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ville
                  </label>
                  <input
                    name="ville"
                    value={stakeholderForm.ville}
                    onChange={handleStakeholderChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Ex: Safi"
                    required
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  name="email"
                  value={stakeholderForm.email}
                  onChange={handleStakeholderChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="email@exemple.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Téléphone
                </label>
                <input
                  name="telephone"
                  value={stakeholderForm.telephone}
                  onChange={handleStakeholderChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="0600000000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Adresse
                </label>
                <input
                  name="adresse"
                  value={stakeholderForm.adresse}
                  onChange={handleStakeholderChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Adresse facultative"
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={closeStakeholderFlow}
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