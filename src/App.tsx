import React, { useState, useMemo } from 'react';
import {
  Building2,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  PlusCircle,
  Search,
  Download,
  Trash2,
  Edit3,
  CheckSquare,
  ArrowUpRight,
  ArrowDownLeft,
  Layers,
  Database,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Check,
  X,
  Zap,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock Currency Rates (Base: XOF)
const EXCHANGE_RATES = {
  XOF: 1,
  EUR: 655.957,
  USD: 600.0,
};

const INITIAL_BANKS = [
  {
    id: 'bank-1',
    nom: 'Ecobank Togo',
    compte: 'TG054 01001 12345678901 45',
    devise: 'XOF',
    soldeInitial: 45000000,
    soldeOfficiel: 48500000,
    dateDernierReleve: '2026-03-15',
    decouvertAutorise: 15000000,
    couleur: '#1e40af', // Blue
  },
  {
    id: 'bank-2',
    nom: 'BOA (Bank of Africa)',
    compte: 'TG012 02005 98765432100 12',
    devise: 'XOF',
    soldeInitial: 22000000,
    soldeOfficiel: 28400000,
    dateDernierReleve: '2026-03-16',
    decouvertAutorise: 10000000,
    couleur: '#047857', // Emerald
  },
  {
    id: 'bank-3',
    nom: 'NSIA Banque',
    compte: 'TG088 03002 45678912300 88',
    devise: 'XOF',
    soldeInitial: 12000000,
    soldeOfficiel: 14200000,
    dateDernierReleve: '2026-03-14',
    decouvertAutorise: 5000000,
    couleur: '#7c3aed', // Violet
  },
  {
    id: 'bank-4',
    nom: 'Orabank Togo',
    compte: 'TG061 04010 33344455566 99',
    devise: 'EUR',
    soldeInitial: 35000,
    soldeOfficiel: 42000,
    dateDernierReleve: '2026-03-12',
    decouvertAutorise: 10000,
    couleur: '#d97706', // Amber
  },
];

const INITIAL_OPERATIONS = [
  {
    id: 'op-1',
    bankId: 'bank-1',
    type: 'Chèque émis',
    nature: 'DEC', // DEC = Décaissement, ENC = Encaissement
    libelle: 'Règlement Fournisseur SOTUBO',
    montant: 4500000,
    dateEmission: '2026-02-10',
    datePrevisionnelle: '2026-02-25',
    tiers: 'SOTUBO SARL',
    reference: 'CHQ-889012',
    statut: 'En attente',
    pieceJointe: 'Facture_SOTUBO_2026.pdf',
  },
  {
    id: 'op-2',
    bankId: 'bank-1',
    type: 'Virement émis',
    nature: 'DEC',
    libelle: 'Paie Salaires Février 2026',
    montant: 18200000,
    dateEmission: '2026-03-01',
    datePrevisionnelle: '2026-03-05',
    tiers: 'Personnel Entreprise',
    reference: 'VIR-2026-034',
    statut: 'En attente',
    pieceJointe: 'Etat_Salaires_022026.pdf',
  },
  {
    id: 'op-3',
    bankId: 'bank-1',
    type: 'Chèque reçu',
    nature: 'ENC',
    libelle: 'Acompte Client TOGO TELECOM',
    montant: 12500000,
    dateEmission: '2026-03-10',
    datePrevisionnelle: '2026-03-18',
    tiers: 'TOGO TELECOM',
    reference: 'CHQ-554109',
    statut: 'En attente',
    pieceJointe: 'Cheque_TogoTel.png',
  },
  {
    id: 'op-4',
    bankId: 'bank-2',
    type: 'Remise de chèque',
    nature: 'ENC',
    libelle: 'Encaissement Ventes Gros - SuperGros',
    montant: 8750000,
    dateEmission: '2026-03-12',
    datePrevisionnelle: '2026-03-17',
    tiers: 'SuperGros Distribution',
    reference: 'REM-2026-012',
    statut: 'En attente',
    pieceJointe: 'Bordereau_Remise_887.pdf',
  },
  {
    id: 'op-5',
    bankId: 'bank-2',
    type: 'Chèque émis',
    nature: 'DEC',
    libelle: 'Paiement Loyer Siège Q1',
    montant: 6000000,
    dateEmission: '2026-01-20',
    datePrevisionnelle: '2026-02-01',
    tiers: 'Immobilière du Golfe',
    reference: 'CHQ-100234',
    statut: 'En attente',
    pieceJointe: 'Quittance_Loyer.pdf',
  },
  {
    id: 'op-6',
    bankId: 'bank-3',
    type: 'Effet à payer',
    nature: 'DEC',
    libelle: 'LCR Fournisseur Equipement BTP',
    montant: 3400000,
    dateEmission: '2026-02-15',
    datePrevisionnelle: '2026-03-30',
    tiers: 'CATERPILLAR West Africa',
    reference: 'LCR-2026-90',
    statut: 'En attente',
    pieceJointe: 'Traite_Cat_Mar.pdf',
  },
  {
    id: 'op-7',
    bankId: 'bank-3',
    type: 'Virement reçu annoncé',
    nature: 'ENC',
    libelle: 'Subvention Projet Investissement',
    montant: 15000000,
    dateEmission: '2026-03-14',
    datePrevisionnelle: '2026-03-22',
    tiers: 'Ministère des Finances',
    reference: 'VIR-GOV-998',
    statut: 'En attente',
    pieceJointe: 'Notification_Accord.pdf',
  },
  {
    id: 'op-8',
    bankId: 'bank-4',
    type: 'Virement émis',
    nature: 'DEC',
    libelle: 'Achat devises importations',
    montant: 8500, // EUR
    dateEmission: '2026-03-11',
    datePrevisionnelle: '2026-03-19',
    tiers: 'SGS Inspection',
    reference: 'VIR-EUR-009',
    statut: 'En attente',
    pieceJointe: 'Invoice_SGS_EUR.pdf',
  },
  {
    id: 'op-9',
    bankId: 'bank-1',
    type: 'Frais bancaires prévisionnels',
    nature: 'DEC',
    libelle: 'Agios & Commission tenue de compte Q1',
    montant: 450000,
    dateEmission: '2026-03-15',
    datePrevisionnelle: '2026-03-31',
    tiers: 'Ecobank Togo',
    reference: 'AGI-2026-Q1',
    statut: 'En attente',
    pieceJointe: '',
  },
  {
    id: 'op-10',
    bankId: 'bank-2',
    type: 'Chèque émis',
    nature: 'DEC',
    libelle: 'Avance travaux Rénovation Agence',
    montant: 2500000,
    dateEmission: '2026-02-01',
    datePrevisionnelle: '2026-02-10',
    tiers: 'Entreprise BTP Moderne',
    reference: 'CHQ-100235',
    statut: 'En attente',
    pieceJointe: '',
  },
  {
    id: 'op-11',
    bankId: 'bank-1',
    type: 'Chèque émis',
    nature: 'DEC',
    libelle: 'Achat fournitures de bureau',
    montant: 1200000,
    dateEmission: '2026-03-02',
    datePrevisionnelle: '2026-03-08',
    tiers: 'Papeterie Centrale',
    reference: 'CHQ-889010',
    statut: 'Encaissé',
    pieceJointe: '',
  },
  {
    id: 'op-12',
    bankId: 'bank-2',
    type: 'Virement reçu annoncé',
    nature: 'ENC',
    libelle: 'Règlement Facture F-2026-09',
    montant: 6200000,
    dateEmission: '2026-03-05',
    datePrevisionnelle: '2026-03-10',
    tiers: 'Société CIMTOGO',
    reference: 'VIR-CIM-44',
    statut: 'Encaissé',
    pieceJointe: '',
  },
];

const INITIAL_STATEMENT_LINES = [
  {
    id: 'st-1',
    bankId: 'bank-1',
    date: '2026-03-15',
    libelle: 'VIR SEPA SALAIRES FEVR',
    montant: -18200000,
    reference: 'VIR-2026-034',
    adapte: false,
  },
  {
    id: 'st-2',
    bankId: 'bank-1',
    date: '2026-03-14',
    libelle: 'REMISE CHEQUE CLIENT 554109',
    montant: 12500000,
    reference: 'CHQ-554109',
    adapte: false,
  },
  {
    id: 'st-3',
    bankId: 'bank-1',
    date: '2026-03-12',
    libelle: 'PRELEVEMENT ELECTRICITE CEET',
    montant: -890000,
    reference: 'CEET-MARS',
    adapte: false,
  },
  {
    id: 'st-4',
    bankId: 'bank-2',
    date: '2026-03-16',
    libelle: 'VIR RECU SUPERGROS DISTRIB',
    montant: 8750000,
    reference: 'REM-2026-012',
    adapte: false,
  },
  {
    id: 'st-5',
    bankId: 'bank-2',
    date: '2026-03-11',
    libelle: 'CHEQUE 100234 IMMO GOLFE',
    montant: -6000000,
    reference: 'CHQ-100234',
    adapte: false,
  },
  {
    id: 'st-6',
    bankId: 'bank-3',
    date: '2026-03-15',
    libelle: 'VIR RECU MINISTERE FINANCES',
    montant: 15000000,
    reference: 'VIR-GOV-998',
    adapte: false,
  },
];

const SUPABASE_SQL_SCRIPT = `-- ====================================================================
-- SCHEMA SUPABASE - APPLICATION DE GESTION DE TRÉSORERIE MULTI-BANQUES
-- DAF / TRESO HQ - SOLDE RÉEL EN TEMPS RÉEL
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE role_utilisateur AS ENUM ('DAF', 'Comptable', 'Lecture_Seule');
CREATE TYPE devise_code AS ENUM ('XOF', 'EUR', 'USD');
CREATE TYPE type_operation AS ENUM (
  'Chèque émis', 
  'Virement émis', 
  'Effet à payer', 
  'Virement reçu annoncé', 
  'Chèque reçu', 
  'Frais bancaires prévisionnels', 
  'Remise de chèque'
);
CREATE TYPE nature_operation AS ENUM ('ENC', 'DEC'); -- Encaissement, Décaissement
CREATE TYPE statut_operation AS ENUM ('En attente', 'Encaissé', 'Rejeté', 'Annulé');

-- 3. TABLE DES UTILISATEURS / ROLES
CREATE TABLE public.utilisateurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  role role_utilisateur DEFAULT 'Comptable',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE DES BANQUES
CREATE TABLE public.banques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  numero_compte TEXT NOT NULL,
  devise devise_code DEFAULT 'XOF',
  solde_initial NUMERIC(15, 2) DEFAULT 0.00,
  solde_officiel NUMERIC(15, 2) DEFAULT 0.00,
  date_dernier_releve DATE DEFAULT CURRENT_DATE,
  decouvert_autorise NUMERIC(15, 2) DEFAULT 0.00,
  couleur_hex TEXT DEFAULT '#1e40af',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE DES RELEVÉS BANCAIRES IMPORTÉS
CREATE TABLE public.releves_bancaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banque_id UUID REFERENCES public.banques(id) ON DELETE CASCADE,
  nom_fichier TEXT NOT NULL,
  date_releve DATE NOT NULL,
  solde_fin_periode NUMERIC(15, 2) NOT NULL,
  statut TEXT DEFAULT 'Validé',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLE DES OPÉRATIONS INTERNES (PENDING TRANSACTIONS)
CREATE TABLE public.operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banque_id UUID REFERENCES public.banques(id) ON DELETE CASCADE,
  type_op type_operation NOT NULL,
  nature nature_operation NOT NULL,
  libelle TEXT NOT NULL,
  montant NUMERIC(15, 2) NOT NULL CHECK (montant > 0),
  date_emission DATE NOT NULL,
  date_previsionnelle DATE NOT NULL,
  tiers TEXT NOT NULL,
  reference TEXT,
  statut statut_operation DEFAULT 'En attente',
  piece_jointe_url TEXT,
  created_by UUID REFERENCES public.utilisateurs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. VUE POUR CALCUL DU SOLDE RÉEL EN TEMPS RÉEL PAR BANQUE
CREATE OR REPLACE VIEW v_solde_reel_banques AS
SELECT 
  b.id AS banque_id,
  b.nom AS nom_banque,
  b.devise,
  b.solde_officiel AS solde_banque_releve,
  b.decouvert_autorise,
  
  -- Total en attente d'encaissement
  COALESCE(SUM(CASE WHEN o.nature = 'ENC' AND o.statut = 'En attente' THEN o.montant ELSE 0 END), 0) AS total_attente_encaissement,
  
  -- Total en attente de décaissement
  COALESCE(SUM(CASE WHEN o.nature = 'DEC' AND o.statut = 'En attente' THEN o.montant ELSE 0 END), 0) AS total_attente_decaissement,
  
  -- SOLDE RÉEL CALCULÉ = Solde Banque + Encaissements en attente - Décaissements en attente
  (
    b.solde_officiel 
    + COALESCE(SUM(CASE WHEN o.nature = 'ENC' AND o.statut = 'En attente' THEN o.montant ELSE 0 END), 0) 
    - COALESCE(SUM(CASE WHEN o.nature = 'DEC' AND o.statut = 'En attente' THEN o.montant ELSE 0 END), 0)
  ) AS solde_reel,
  
  -- SOLDE DISPONIBLE = Solde Réel + Découvert Autorisé
  (
    (
      b.solde_officiel 
      + COALESCE(SUM(CASE WHEN o.nature = 'ENC' AND o.statut = 'En attente' THEN o.montant ELSE 0 END), 0) 
      - COALESCE(SUM(CASE WHEN o.nature = 'DEC' AND o.statut = 'En attente' THEN o.montant ELSE 0 END), 0)
    ) + b.decouvert_autorise
  ) AS solde_disponible

FROM public.banques b
LEFT JOIN public.operations o ON b.id = o.banque_id
GROUP BY b.id, b.nom, b.devise, b.solde_officiel, b.decouvert_autorise;

-- 8. TRIGGER DE MISE À JOUR DU SOLDE OFFICIEL SUR NOUVEAU RELEVÉ
CREATE OR REPLACE FUNCTION update_solde_officiel_banque()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.banques
  SET solde_officiel = NEW.solde_fin_periode,
      date_dernier_releve = NEW.date_releve
  WHERE id = NEW.banque_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_solde_officiel
AFTER INSERT ON public.releves_bancaires
FOR EACH ROW EXECUTE FUNCTION update_solde_officiel_banque();
`;

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('DAF');
  const [displayCurrency, setDisplayCurrency] = useState('XOF');
  const [banks, setBanks] = useState(INITIAL_BANKS);
  const [operations, setOperations] = useState(INITIAL_OPERATIONS);
  const [statementLines, setStatementLines] = useState(INITIAL_STATEMENT_LINES);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBankFilter, setSelectedBankFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  const [isAddOpModalOpen, setIsAddOpModalOpen] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<any>(null);
  const [editingBank, setEditingBank] = useState<any>(null);

  const [opForm, setOpForm] = useState({
    bankId: INITIAL_BANKS[0].id,
    type: 'Chèque émis',
    nature: 'DEC',
    libelle: '',
    montant: '',
    dateEmission: new Date().toISOString().split('T')[0],
    datePrevisionnelle: new Date().toISOString().split('T')[0],
    tiers: '',
    reference: '',
    statut: 'En attente',
    pieceJointe: '',
  });

  const [bankForm, setBankForm] = useState({
    nom: '',
    compte: '',
    devise: 'XOF',
    soldeInitial: '',
    soldeOfficiel: '',
    decouvertAutorise: '',
    couleur: '#1e40af',
  });

  const [selectedStLineId, setSelectedStLineId] = useState<string | null>(null);
  const [selectedOpId, setSelectedOpId] = useState<string | null>(null);

  const formatCurrency = (amount: number, currency = displayCurrency) => {
    let convertedAmount = amount;
    if (currency !== displayCurrency) {
      if (currency === 'EUR' && displayCurrency === 'XOF')
        convertedAmount = amount * EXCHANGE_RATES.EUR;
      else if (currency === 'USD' && displayCurrency === 'XOF')
        convertedAmount = amount * EXCHANGE_RATES.USD;
      else if (currency === 'XOF' && displayCurrency === 'EUR')
        convertedAmount = amount / EXCHANGE_RATES.EUR;
      else if (currency === 'XOF' && displayCurrency === 'USD')
        convertedAmount = amount / EXCHANGE_RATES.USD;
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: displayCurrency,
      maximumFractionDigits: displayCurrency === 'XOF' ? 0 : 2,
    }).format(convertedAmount);
  };

  const bankCalculations = useMemo(() => {
    return banks.map((bank) => {
      const bankOps = operations.filter(
        (op) => op.bankId === bank.id && op.statut === 'En attente'
      );

      const pendingEncaissements = bankOps
        .filter((op) => op.nature === 'ENC')
        .reduce((sum, op) => sum + Number(op.montant), 0);

      const pendingDecaissements = bankOps
        .filter((op) => op.nature === 'DEC')
        .reduce((sum, op) => sum + Number(op.montant), 0);

      const soldeOfficiel = Number(bank.soldeOfficiel);
      const soldeReel =
        soldeOfficiel + pendingEncaissements - pendingDecaissements;
      const soldeDisponible = soldeReel + Number(bank.decouvertAutorise);

      return {
        ...bank,
        pendingEncaissements,
        pendingDecaissements,
        soldeReel,
        soldeDisponible,
        pendingCount: bankOps.length,
      };
    });
  }, [banks, operations]);

  const totals = useMemo(() => {
    return bankCalculations.reduce(
      (acc, b) => {
        let rate = 1;
        if (b.devise === 'EUR' && displayCurrency === 'XOF')
          rate = EXCHANGE_RATES.EUR;
        if (b.devise === 'USD' && displayCurrency === 'XOF')
          rate = EXCHANGE_RATES.USD;
        if (b.devise === 'XOF' && displayCurrency === 'EUR')
          rate = 1 / EXCHANGE_RATES.EUR;

        acc.soldeOfficiel += b.soldeOfficiel * rate;
        acc.pendingEncaissements += b.pendingEncaissements * rate;
        acc.pendingDecaissements += b.pendingDecaissements * rate;
        acc.soldeReel += b.soldeReel * rate;
        acc.decouvertAutorise += Number(b.decouvertAutorise) * rate;
        acc.soldeDisponible += b.soldeDisponible * rate;
        return acc;
      },
      {
        soldeOfficiel: 0,
        pendingEncaissements: 0,
        pendingDecaissements: 0,
        soldeReel: 0,
        decouvertAutorise: 0,
        soldeDisponible: 0,
      }
    );
  }, [bankCalculations, displayCurrency]);

  const uncashedChequesAlerts = useMemo(() => {
    const today = new Date();
    return operations.filter((op) => {
      if (op.statut !== 'En attente') return false;
      if (!op.type.toLowerCase().includes('chèque')) return false;

      const dateEm = new Date(op.dateEmission);
      const diffTime = Math.abs(today.getTime() - dateEm.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 30;
    });
  }, [operations]);

  const forecastChartData = useMemo(() => {
    const days = [];
    const baseSolde = totals.soldeReel;
    const today = new Date();

    for (let i = 0; i <= 60; i += 5) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const dateStr = forecastDate.toISOString().split('T')[0];

      const opsToDate = operations.filter((op) => {
        if (op.statut !== 'En attente') return false;
        return op.datePrevisionnelle <= dateStr;
      });

      const enc = opsToDate
        .filter((o) => o.nature === 'ENC')
        .reduce((s, o) => s + Number(o.montant), 0);
      const dec = opsToDate
        .filter((o) => o.nature === 'DEC')
        .reduce((s, o) => s + Number(o.montant), 0);

      days.push({
        date: forecastDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
        }),
        SoldeReel: Math.round((baseSolde + enc - dec) / 1000000),
        SoldeOfficiel: Math.round(totals.soldeOfficiel / 1000000),
      });
    }
    return days;
  }, [totals, operations]);

  const handleSaveOperation = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'Lecture_Seule') return;

    if (editingOp) {
      setOperations(
        operations.map((op) =>
          op.id === editingOp.id ? { ...opForm, id: op.id, montant: Number(opForm.montant) } : op
        )
      );
      setEditingOp(null);
    } else {
      const newOp = {
        ...opForm,
        id: `op-${Date.now()}`,
        montant: Number(opForm.montant),
      };
      setOperations([newOp, ...operations]);
    }
    setIsAddOpModalOpen(false);
    resetOpForm();
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'DAF') return;

    if (editingBank) {
      setBanks(
        banks.map((b) =>
          b.id === editingBank.id ? { ...bankForm, id: b.id, soldeInitial: Number(bankForm.soldeInitial), soldeOfficiel: Number(bankForm.soldeOfficiel), decouvertAutorise: Number(bankForm.decouvertAutorise) } : b
        )
      );
      setEditingBank(null);
    } else {
      const newBank = {
        ...bankForm,
        id: `bank-${Date.now()}`,
        soldeInitial: Number(bankForm.soldeInitial),
        soldeOfficiel: Number(bankForm.soldeOfficiel),
        decouvertAutorise: Number(bankForm.decouvertAutorise),
        dateDernierReleve: new Date().toISOString().split('T')[0],
      };
      setBanks([...banks, newBank]);
    }
    setIsAddBankModalOpen(false);
    resetBankForm();
  };

  const handleDeleteOp = (id: string) => {
    if (userRole !== 'DAF') return;
    setOperations(operations.filter((op) => op.id !== id));
  };

  const resetOpForm = () => {
    setOpForm({
      bankId: banks[0]?.id || '',
      type: 'Chèque émis',
      nature: 'DEC',
      libelle: '',
      montant: '',
      dateEmission: new Date().toISOString().split('T')[0],
      datePrevisionnelle: new Date().toISOString().split('T')[0],
      tiers: '',
      reference: '',
      statut: 'En attente',
      pieceJointe: '',
    });
  };

  const resetBankForm = () => {
    setBankForm({
      nom: '',
      compte: '',
      devise: 'XOF',
      soldeInitial: '',
      soldeOfficiel: '',
      decouvertAutorise: '',
      couleur: '#1e40af',
    });
  };

  const handleReconcilePair = (stLine: any, op: any) => {
    if (userRole === 'Lecture_Seule') return;

    setOperations(
      operations.map((o) => (o.id === op.id ? { ...o, statut: 'Encaissé' } : o))
    );

    setStatementLines(
      statementLines.map((s) =>
        s.id === stLine.id ? { ...s, adapte: true } : s
      )
    );

    setSelectedStLineId(null);
    setSelectedOpId(null);
  };

  const handleAutoReconcile = () => {
    if (userRole === 'Lecture_Seule') return;

    let matchedCount = 0;
    let updatedOps = [...operations];
    let updatedStLines = [...statementLines];

    updatedStLines.forEach((st) => {
      if (st.adapte) return;

      const matchIndex = updatedOps.findIndex((op) => {
        if (op.statut !== 'En attente') return false;
        const amountMatch = Math.abs(op.montant) === Math.abs(st.montant);
        const refMatch =
          op.reference &&
          st.reference &&
          (op.reference.includes(st.reference) ||
            st.reference.includes(op.reference));
        return amountMatch && refMatch;
      });

      if (matchIndex !== -1) {
        updatedOps[matchIndex].statut = 'Encaissé';
        st.adapte = true;
        matchedCount++;
      }
    });

    setOperations(updatedOps);
    setStatementLines(updatedStLines);
    alert(
      `Rapprochement intelligent exécuté : ${matchedCount} opérations associées avec succès !`
    );
  };

  const handleExportReport = (type: string) => {
    alert(
      `Génération du rapport de trésorerie DAF en format ${type.toUpperCase()} en cours...`
    );
  };

  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      const matchSearch =
        op.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.tiers.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (op.reference &&
          op.reference.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchBank =
        selectedBankFilter === 'ALL' || op.bankId === selectedBankFilter;
      const matchStatus =
        selectedStatusFilter === 'ALL' || op.statut === selectedStatusFilter;
      const matchType =
        selectedTypeFilter === 'ALL' || op.type === selectedTypeFilter;

      return matchSearch && matchBank && matchStatus && matchType;
    });
  }, [
    operations,
    searchQuery,
    selectedBankFilter,
    selectedStatusFilter,
    selectedTypeFilter,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* HEADER BAR */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  TRÉSO HQ
                </span>
                <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  Multi-Banques
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Gestion de Trésorerie & Solde Réel DAF
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs">
              <span className="text-slate-400 px-2 font-medium hidden md:inline">
                Devise affichage :
              </span>
              {['XOF', 'EUR', 'USD'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setDisplayCurrency(curr)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    displayCurrency === curr
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium hidden sm:inline">
                Rôle :
              </span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="DAF" className="bg-slate-800 text-white">
                  DAF (Accès Total)
                </option>
                <option value="Comptable" className="bg-slate-800 text-white">
                  Comptable (Saisie/Edit)
                </option>
                <option
                  value="Lecture_Seule"
                  className="bg-slate-800 text-white"
                >
                  Lecture seule
                </option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS BAR */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-20 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 py-2">
          {[
            { id: 'dashboard', label: 'Tableau de Bord DAF', icon: BarChart3 },
            { id: 'banks', label: 'Gestion Banques', icon: Building2 },
            {
              id: 'operations',
              label: 'Opérations Internes',
              icon: Layers,
              badge: operations.filter((o) => o.statut === 'En attente').length,
            },
            { id: 'reconciliation', label: 'Rapprochement', icon: CheckSquare },
            { id: 'statements', label: 'Relevés & Imports', icon: FileText },
            {
              id: 'forecast',
              label: 'Prévisionnel 30/60/90j',
              icon: TrendingUp,
            },
            { id: 'sql', label: 'Supabase SQL', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        {/* TOP ALERT BANNER */}
        {uncashedChequesAlerts.length > 0 && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Alerte Trésorerie : {uncashedChequesAlerts.length} chèque(s)
                  non encaissé(s) depuis +30 jours
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Ces chèques en attente impactent le solde réel. Pensez à
                  relancer les émetteurs ou vérifier le dépôt en banque.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {uncashedChequesAlerts.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300"
                    >
                      {c.reference} - {c.tiers} ({formatCurrency(c.montant)})
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('operations')}
              className="text-xs text-amber-800 font-bold hover:underline whitespace-nowrap ml-4"
            >
              Voir les opérations &rarr;
            </button>
          </div>
        )}

        {/* TAB 1: TABLEAU DE BORD DAF */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Zap className="w-4 h-4" />
                    <span>Moteur de Calcul du Solde Réel DAF</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    Formule du Solde Réel Intégré
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                    <span className="text-amber-300 font-semibold">
                      Solde Réel
                    </span>{' '}
                    = Solde Banque (Dernier Relevé) + Encaissements en attente -
                    Décaissements en attente
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setIsAddOpModalOpen(true);
                      setEditingOp(null);
                      resetOpForm();
                    }}
                    disabled={userRole === 'Lecture_Seule'}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Saisir une Opération</span>
                  </button>
                  <button
                    onClick={() => handleExportReport('pdf')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl transition flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export DAF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Solde Banque Officiel
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      {formatCurrency(totals.soldeOfficiel)}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      + À Encaisser
                    </span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1">
                      + {formatCurrency(totals.pendingEncaissements)}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                      - À Décaisser
                    </span>
                    <h3 className="text-2xl font-black text-rose-600 mt-1">
                      - {formatCurrency(totals.pendingDecaissements)}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                      SOLDE RÉEL DISPONIBLE
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {formatCurrency(totals.soldeReel)}
                    </h3>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-xl text-white backdrop-blur-sm">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* BANQUE CARDS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Synthèse des Solde Réels par Banque</span>
                </h3>
                <button
                  onClick={() => setActiveTab('banks')}
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Gérer les comptes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {bankCalculations.map((bank) => (
                  <div
                    key={bank.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {bank.nom}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {bank.devise}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mb-3 truncate">
                        {bank.compte}
                      </p>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Solde Relevé :</span>
                          <span className="font-medium text-slate-800">
                            {formatCurrency(bank.soldeOfficiel, bank.devise)}
                          </span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                          <span>+ À encaissem. :</span>
                          <span className="font-medium">
                            +
                            {formatCurrency(
                              bank.pendingEncaissements,
                              bank.devise
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-rose-600">
                          <span>- À décaissem. :</span>
                          <span className="font-medium">
                            -
                            {formatCurrency(
                              bank.pendingDecaissements,
                              bank.devise
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          Solde Réel
                        </span>
                        <span className="text-base font-black text-blue-900">
                          {formatCurrency(bank.soldeReel, bank.devise)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHART AREA */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Évolution & Prévisionnel du Solde Réel (en Millions)</span>
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={forecastChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorReel"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="SoldeReel"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorReel)"
                      name="Solde Réel Prévu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BANQUES */}
        {activeTab === 'banks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">
                Gestion des Comptes & Banques
              </h2>
              <button
                onClick={() => {
                  setIsAddBankModalOpen(true);
                  setEditingBank(null);
                  resetBankForm();
                }}
                disabled={userRole !== 'DAF'}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajouter une banque (DAF)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bankCalculations.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                          {bank.devise} ACCOUNT
                        </span>
                        <h3 className="text-xl font-black text-slate-900">
                          {bank.nom}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">
                          {bank.compte}
                        </p>
                      </div>
                      {userRole === 'DAF' && (
                        <button
                          onClick={() => {
                            setEditingBank(bank);
                            setBankForm({
                              nom: bank.nom,
                              compte: bank.compte,
                              devise: bank.devise,
                              soldeInitial: String(bank.soldeInitial),
                              soldeOfficiel: String(bank.soldeOfficiel),
                              decouvertAutorise: String(bank.decouvertAutorise),
                              couleur: bank.couleur,
                            });
                            setIsAddBankModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg text-xs"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                          Solde Relevé Officiel
                        </span>
                        <p className="text-base font-extrabold text-slate-800">
                          {formatCurrency(bank.soldeOfficiel, bank.devise)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] text-blue-600 uppercase font-bold">
                          Solde Réel Calculé
                        </span>
                        <p className="text-base font-black text-blue-900">
                          {formatCurrency(bank.soldeReel, bank.devise)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OPÉRATIONS */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">
                Saisie des Opérations Internes
              </h2>
              <button
                onClick={() => {
                  setIsAddOpModalOpen(true);
                  setEditingOp(null);
                  resetOpForm();
                }}
                disabled={userRole === 'Lecture_Seule'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Saisir une nouvelle opération</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-3.5">Statut</th>
                      <th className="p-3.5">Dates</th>
                      <th className="p-3.5">Type & Libellé</th>
                      <th className="p-3.5">Tiers</th>
                      <th className="p-3.5 text-right">Montant</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredOperations.map((op) => {
                      const bank = banks.find((b) => b.id === op.bankId);
                      return (
                        <tr key={op.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                              {op.statut}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600">{op.dateEmission}</td>
                          <td className="p-3.5 font-semibold text-slate-900">{op.libelle}</td>
                          <td className="p-3.5 text-slate-700">{op.tiers}</td>
                          <td className={`p-3.5 text-right font-black ${op.nature === 'ENC' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {op.nature === 'ENC' ? '+' : '-'}{formatCurrency(op.montant, bank?.devise)}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                            {userRole !== 'Lecture_Seule' && (
                              <button
                                onClick={() => {
                                  setEditingOp(op);
                                  setOpForm({
                                    ...op,
                                    montant: String(op.montant)
                                  });
                                  setIsAddOpModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-600"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            {userRole === 'DAF' && (
                              <button
                                onClick={() => handleDeleteOp(op.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RAPPROCHEMENT */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">
                Rapprochement Bancaire Intelligent
              </h2>
              <button
                onClick={handleAutoReconcile}
                disabled={userRole === 'Lecture_Seule'}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Rapprochement Automatique</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Lignes Relevé Bancaire</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {statementLines.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => !st.adapte && setSelectedStLineId(st.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        st.adapte
                          ? 'bg-slate-50 opacity-50 cursor-not-allowed'
                          : selectedStLineId === st.id
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                          : 'bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{st.libelle}</p>
                          <p className="text-[10px] text-slate-400">{st.date}</p>
                        </div>
                        <span className={`text-sm font-black ${st.montant > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {formatCurrency(st.montant)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Opérations Internes En Attente</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {operations
                    .filter((o) => o.statut === 'En attente')
                    .map((op) => (
                      <div
                        key={op.id}
                        onClick={() => setSelectedOpId(op.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          selectedOpId === op.id
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                            : 'bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{op.libelle}</p>
                            <p className="text-[10px] text-slate-400">{op.tiers}</p>
                          </div>
                          <span className={`text-sm font-black ${op.nature === 'ENC' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {formatCurrency(op.montant)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {selectedStLineId && selectedOpId && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 flex justify-between items-center">
                <span>1 ligne de relevé et 1 opération sélectionnées.</span>
                <button
                  onClick={() => {
                    const st = statementLines.find((s) => s.id === selectedStLineId);
                    const op = operations.find((o) => o.id === selectedOpId);
                    if (st && op) handleReconcilePair(st, op);
                  }}
                  className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Valider le Rapprochement
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STATEMENTS */}
        {activeTab === 'statements' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Importation & Relevés Bancaires</h2>
            <p className="text-xs text-slate-500">
              Dans la gestion de trésorerie DAF, le solde officiel issu du relevé bancaire fait foi.
            </p>
          </div>
        )}

        {/* TAB 6: FORECAST */}
        {activeTab === 'forecast' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Prévisionnel 30 / 60 / 90 Jours</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="SoldeReel" stroke="#2563eb" fill="#93c5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 7: SUPABASE SQL */}
        {activeTab === 'sql' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Schéma SQL Supabase</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
                  alert('Code SQL copié !');
                }}
                className="bg-slate-900 text-white text-xs px-4 py-2 rounded-xl"
              >
                Copier le SQL
              </button>
            </div>
            <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl font-mono text-xs overflow-x-auto">
              <pre>{SUPABASE_SQL_SCRIPT}</pre>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: SAISIE OPÉRATION */}
      {isAddOpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">
                {editingOp ? "Modifier l'Opération" : 'Nouvelle Opération Internes'}
              </h3>
              <button onClick={() => setIsAddOpModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveOperation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Compte Bancaire</label>
                <select
                  value={opForm.bankId}
                  onChange={(e) => setOpForm({ ...opForm, bankId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                >
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nom} ({b.devise})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Libellé / Motif</label>
                <input
                  type="text"
                  value={opForm.libelle}
                  onChange={(e) => setOpForm({ ...opForm, libelle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tiers</label>
                  <input
                    type="text"
                    value={opForm.tiers}
                    onChange={(e) => setOpForm({ ...opForm, tiers: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Montant</label>
                  <input
                    type="number"
                    value={opForm.montant}
                    onChange={(e) => setOpForm({ ...opForm, montant: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SAISIE BANQUE */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">
                {editingBank ? 'Modifier la Banque' : 'Ajouter une Banque'}
              </h3>
              <button onClick={() => setIsAddBankModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom de la Banque</label>
                <input
                  type="text"
                  value={bankForm.nom}
                  onChange={(e) => setBankForm({ ...bankForm, nom: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Numéro de Compte (RIB/IBAN)</label>
                <input
                  type="text"
                  value={bankForm.compte}
                  onChange={(e) => setBankForm({ ...bankForm, compte: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Solde Officiel Relevé</label>
                  <input
                    type="number"
                    value={bankForm.soldeOfficiel}
                    onChange={(e) => setBankForm({ ...bankForm, soldeOfficiel: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Découvert Autorisé</label>
                  <input
                    type="number"
                    value={bankForm.decouvertAutorise}
                    onChange={(e) => setBankForm({ ...bankForm, decouvertAutorise: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddBankModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
