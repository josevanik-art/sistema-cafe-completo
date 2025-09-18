"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Coffee, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Palette,
  Package,
  X,
  Calculator,
  AlertTriangle,
  Printer
} from 'lucide-react'

// Tipos de dados
interface Partner {
  id: string
  name: string
  type: 'colaborador' | 'cliente' | 'fornecedor'
  email: string
  phone: string
  address: string
  status: 'ativo' | 'inativo'
}

interface Bank {
  id: string
  name: string
  accountNumber: string
  iban: string
  swift: string
  balance: number
}

interface Transaction {
  id: string
  type: 'compra' | 'venda' | 'financiamento' | 'recolha'
  partnerId: string
  bankId: string
  amount: number
  quantity: number
  pricePerKg: number
  date: string
  status: 'pendente' | 'concluida' | 'cancelada'
  description: string
  coffeeType: 'comercial' | 'coco'
  financedQuantity?: number // Para controle de café financiado
}

interface SystemSettings {
  primaryColor: string
  backgroundColor: string
  currency: string
  companyName: string
  companyNif: string
}

interface CoffeeStock {
  totalQuantity: number
  lastUpdated: string
  comercialQuantity: number
  cocoQuantity: number
  financedQuantity: number // Quantidade total financiada
  financedComercial: number // Quantidade comercial financiada
  financedCoco: number // Quantidade côco financiada
}

interface ReportFilters {
  dateFrom: string
  dateTo: string
  transactionType: string
  partnerId: string
  bankId: string
  coffeeType: string
}

// Dados mockados iniciais
const initialPartners: Partner[] = [
  {
    id: '1',
    name: 'João Silva',
    type: 'fornecedor',
    email: 'joao@email.com',
    phone: '+244 923 456 789',
    address: 'Luanda, Angola',
    status: 'ativo'
  },
  {
    id: '2',
    name: 'Maria Santos',
    type: 'cliente',
    email: 'maria@email.com',
    phone: '+244 924 567 890',
    address: 'Benguela, Angola',
    status: 'ativo'
  }
]

const initialBanks: Bank[] = [
  {
    id: '1',
    name: 'Banco BAI',
    accountNumber: '123456789',
    iban: 'AO06000000123456789',
    swift: 'BAIAAOAO',
    balance: 2500000
  }
]

const currencies = [
  { code: 'AOA', name: 'Kwanza Angolano', symbol: 'Kz' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥' },
  { code: 'CHF', name: 'Franco Suíço', symbol: 'CHF' },
  { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
  { code: 'CNY', name: 'Yuan Chinês', symbol: '¥' },
  { code: 'ZAR', name: 'Rand Sul-Africano', symbol: 'R' },
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
  { code: 'INR', name: 'Rupia Indiana', symbol: '₹' },
  { code: 'KRW', name: 'Won Sul-Coreano', symbol: '₩' },
  { code: 'SGD', name: 'Dólar de Singapura', symbol: 'S$' },
  { code: 'NOK', name: 'Coroa Norueguesa', symbol: 'kr' },
  { code: 'SEK', name: 'Coroa Sueca', symbol: 'kr' },
  { code: 'DKK', name: 'Coroa Dinamarquesa', symbol: 'kr' },
  { code: 'PLN', name: 'Zloty Polonês', symbol: 'zł' },
  { code: 'CZK', name: 'Coroa Tcheca', symbol: 'Kč' },
  { code: 'HUF', name: 'Forint Húngaro', symbol: 'Ft' },
  { code: 'RUB', name: 'Rublo Russo', symbol: '₽' },
  { code: 'TRY', name: 'Lira Turca', symbol: '₺' },
  { code: 'ILS', name: 'Shekel Israelense', symbol: '₪' },
  { code: 'AED', name: 'Dirham dos Emirados', symbol: 'د.إ' },
  { code: 'SAR', name: 'Riyal Saudita', symbol: '﷼' },
  { code: 'EGP', name: 'Libra Egípcia', symbol: '£' },
  { code: 'MAD', name: 'Dirham Marroquino', symbol: 'د.م.' },
  { code: 'NGN', name: 'Naira Nigeriana', symbol: '₦' },
  { code: 'GHS', name: 'Cedi Ganês', symbol: '₵' },
  { code: 'KES', name: 'Xelim Queniano', symbol: 'KSh' },
  { code: 'UGX', name: 'Xelim Ugandense', symbol: 'USh' },
  { code: 'TZS', name: 'Xelim Tanzaniano', symbol: 'TSh' },
  { code: 'ZMW', name: 'Kwacha Zambiano', symbol: 'ZK' },
  { code: 'BWP', name: 'Pula de Botsuana', symbol: 'P' },
  { code: 'MZN', name: 'Metical Moçambicano', symbol: 'MT' },
  { code: 'CVE', name: 'Escudo Cabo-verdiano', symbol: '$' },
  { code: 'STN', name: 'Dobra de São Tomé', symbol: 'Db' },
  { code: 'XOF', name: 'Franco CFA Ocidental', symbol: 'CFA' },
  { code: 'XAF', name: 'Franco CFA Central', symbol: 'FCFA' }
]

const colors = [
  { name: 'Verde Café', value: 'from-green-600 to-emerald-700' },
  { name: 'Marrom Café', value: 'from-amber-700 to-orange-800' },
  { name: 'Azul Corporativo', value: 'from-blue-600 to-indigo-700' },
  { name: 'Roxo Moderno', value: 'from-purple-600 to-violet-700' },
  { name: 'Vermelho Elegante', value: 'from-red-600 to-rose-700' },
  { name: 'Ciano Vibrante', value: 'from-cyan-500 to-blue-600' },
  { name: 'Rosa Moderno', value: 'from-pink-500 to-rose-600' },
  { name: 'Laranja Energético', value: 'from-orange-500 to-red-600' },
  { name: 'Teal Elegante', value: 'from-teal-500 to-cyan-600' },
  { name: 'Índigo Profundo', value: 'from-indigo-500 to-purple-600' },
  { name: 'Esmeralda', value: 'from-emerald-500 to-green-600' },
  { name: 'Âmbar Dourado', value: 'from-amber-500 to-orange-600' },
  { name: 'Slate Moderno', value: 'from-slate-600 to-gray-700' },
  { name: 'Violeta Luxo', value: 'from-violet-500 to-purple-600' },
  { name: 'Lime Vibrante', value: 'from-lime-500 to-green-600' }
]

const backgroundColors = [
  { name: 'Branco Clássico', value: 'bg-white', preview: 'bg-white' },
  { name: 'Cinza Claro', value: 'bg-gray-50', preview: 'bg-gray-50' },
  { name: 'Azul Suave', value: 'bg-blue-50', preview: 'bg-blue-50' },
  { name: 'Verde Suave', value: 'bg-green-50', preview: 'bg-green-50' },
  { name: 'Âmbar Suave', value: 'bg-amber-50', preview: 'bg-amber-50' },
  { name: 'Rosa Suave', value: 'bg-rose-50', preview: 'bg-rose-50' },
  { name: 'Roxo Suave', value: 'bg-purple-50', preview: 'bg-purple-50' },
  { name: 'Ciano Suave', value: 'bg-cyan-50', preview: 'bg-cyan-50' },
  { name: 'Laranja Suave', value: 'bg-orange-50', preview: 'bg-orange-50' },
  { name: 'Teal Suave', value: 'bg-teal-50', preview: 'bg-teal-50' },
  { name: 'Índigo Suave', value: 'bg-indigo-50', preview: 'bg-indigo-50' },
  { name: 'Esmeralda Suave', value: 'bg-emerald-50', preview: 'bg-emerald-50' },
  { name: 'Slate Suave', value: 'bg-slate-50', preview: 'bg-slate-50' },
  { name: 'Violeta Suave', value: 'bg-violet-50', preview: 'bg-violet-50' },
  { name: 'Lime Suave', value: 'bg-lime-50', preview: 'bg-lime-50' }
]

export default function CoffeeManagementSystem() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [banks, setBanks] = useState<Bank[]>(initialBanks)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [coffeeStock, setCoffeeStock] = useState<CoffeeStock>({
    totalQuantity: 0,
    lastUpdated: new Date().toISOString(),
    comercialQuantity: 0,
    cocoQuantity: 0,
    financedQuantity: 0,
    financedComercial: 0,
    financedCoco: 0
  })
  const [settings, setSettings] = useState<SystemSettings>({
    primaryColor: 'from-green-600 to-emerald-700',
    backgroundColor: 'bg-gray-50',
    currency: 'AOA',
    companyName: 'CoffeeSystem Pro',
    companyNif: ''
  })
  
  // Estados para modais
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false)
  
  // Estados para edição
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [editingBank, setEditingBank] = useState<Bank | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  
  // Estados para formulários
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({})
  const [newBank, setNewBank] = useState<Partial<Bank>>({})
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({})

  // Estados para relatórios
  const [selectedReportType, setSelectedReportType] = useState<'semanal' | 'mensal' | 'anual' | 'personalizado'>('semanal')
  const [reportFilters, setReportFilters] = useState<ReportFilters>({
    dateFrom: '',
    dateTo: '',
    transactionType: 'todos',
    partnerId: 'todos',
    bankId: 'todos',
    coffeeType: 'todos'
  })

  // Função para formatar moeda
  const formatCurrency = (amount: number) => {
    const currency = currencies.find(c => c.code === settings.currency)
    return `${currency?.symbol || 'Kz'} ${amount.toLocaleString('pt-AO')}`
  }

  // Função para calcular valor total automaticamente
  const calculateTotalAmount = (quantity: number, pricePerKg: number) => {
    return quantity * pricePerKg
  }

  // Atualizar valor total quando quantidade ou preço mudam
  useEffect(() => {
    if (newTransaction.quantity && newTransaction.pricePerKg) {
      const totalAmount = calculateTotalAmount(newTransaction.quantity, newTransaction.pricePerKg)
      setNewTransaction(prev => ({ ...prev, amount: totalAmount }))
    }
  }, [newTransaction.quantity, newTransaction.pricePerKg])

  // Função para limpar todos os dados do sistema
  const clearAllData = () => {
    if (confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema (transações, parceiros, bancos e estoque). Esta ação não pode ser desfeita. Tem certeza que deseja continuar?')) {
      if (confirm('🚨 CONFIRMAÇÃO FINAL: Todos os dados serão perdidos permanentemente. Digite "CONFIRMAR" para prosseguir ou cancele.')) {
        // Resetar todos os dados para o estado inicial
        setTransactions([])
        setPartners(initialPartners)
        setBanks(initialBanks)
        setCoffeeStock({
          totalQuantity: 0,
          lastUpdated: new Date().toISOString(),
          comercialQuantity: 0,
          cocoQuantity: 0,
          financedQuantity: 0,
          financedComercial: 0,
          financedCoco: 0
        })
        
        // Manter apenas as configurações básicas
        setSettings(prev => ({
          ...prev,
          // Manter cor, moeda e nome da empresa, mas resetar NIF se desejado
        }))
        
        setIsClearDataModalOpen(false)
        alert('✅ Todos os dados foram limpos com sucesso! O sistema foi resetado para o estado inicial.')
      }
    }
  }

  // Função para obter datas dos relatórios
  const getReportDateRange = (type: 'semanal' | 'mensal' | 'anual') => {
    const now = new Date()
    const startDate = new Date()
    
    switch (type) {
      case 'semanal':
        startDate.setDate(now.getDate() - 7)
        break
      case 'mensal':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'anual':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    return {
      from: startDate.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0]
    }
  }

  // Função para filtrar transações
  const getFilteredTransactions = () => {
    let filtered = [...transactions]
    
    // Aplicar filtros de data baseado no tipo de relatório
    if (selectedReportType !== 'personalizado') {
      const dateRange = getReportDateRange(selectedReportType)
      filtered = filtered.filter(t => t.date >= dateRange.from && t.date <= dateRange.to)
    } else {
      // Filtros personalizados
      if (reportFilters.dateFrom) {
        filtered = filtered.filter(t => t.date >= reportFilters.dateFrom)
      }
      if (reportFilters.dateTo) {
        filtered = filtered.filter(t => t.date <= reportFilters.dateTo)
      }
    }
    
    // Outros filtros
    if (reportFilters.transactionType && reportFilters.transactionType !== 'todos') {
      filtered = filtered.filter(t => t.type === reportFilters.transactionType)
    }
    if (reportFilters.partnerId && reportFilters.partnerId !== 'todos') {
      filtered = filtered.filter(t => t.partnerId === reportFilters.partnerId)
    }
    if (reportFilters.bankId && reportFilters.bankId !== 'todos') {
      filtered = filtered.filter(t => t.bankId === reportFilters.bankId)
    }
    if (reportFilters.coffeeType && reportFilters.coffeeType !== 'todos') {
      filtered = filtered.filter(t => t.coffeeType === reportFilters.coffeeType)
    }
    
    return filtered
  }

  // Função para calcular estatísticas do relatório
  const getReportStats = () => {
    const filteredTransactions = getFilteredTransactions()
    
    const vendas = filteredTransactions.filter(t => t.type === 'venda')
    const compras = filteredTransactions.filter(t => t.type === 'compra')
    const financiamentos = filteredTransactions.filter(t => t.type === 'financiamento')
    const recolhas = filteredTransactions.filter(t => t.type === 'recolha')
    
    return {
      totalTransactions: filteredTransactions.length,
      totalVendas: vendas.reduce((sum, t) => sum + t.amount, 0),
      totalCompras: compras.reduce((sum, t) => sum + t.amount, 0),
      totalFinanciamentos: financiamentos.reduce((sum, t) => sum + t.amount, 0),
      totalRecolhas: recolhas.reduce((sum, t) => sum + t.quantity, 0),
      quantidadeVendida: vendas.reduce((sum, t) => sum + t.quantity, 0),
      quantidadeComprada: compras.reduce((sum, t) => sum + t.quantity, 0),
      quantidadeRecolhida: recolhas.reduce((sum, t) => sum + t.quantity, 0),
      quantidadeFinanciada: financiamentos.reduce((sum, t) => sum + (t.financedQuantity || 0), 0),
      transactions: filteredTransactions
    }
  }

  // Função para limpar filtros
  const clearFilters = () => {
    setReportFilters({
      dateFrom: '',
      dateTo: '',
      transactionType: 'todos',
      partnerId: 'todos',
      bankId: 'todos',
      coffeeType: 'todos'
    })
  }

  // Função para abrir relatório específico
  const openReport = (type: 'semanal' | 'mensal' | 'anual') => {
    setSelectedReportType(type)
    clearFilters() // Limpar filtros personalizados ao abrir relatório predefinido
    setIsReportModalOpen(true)
  }

  // Função para baixar relatório em PDF
  const downloadReportPDF = () => {
    const stats = getReportStats()
    const reportTitle = selectedReportType === 'personalizado' ? 'Relatório Personalizado' : 
      selectedReportType === 'semanal' ? 'Relatório Semanal' :
      selectedReportType === 'mensal' ? 'Relatório Mensal' : 'Relatório Anual'
    
    // Criar conteúdo HTML para o PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle} - ${settings.companyName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company-info { margin-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .stat-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .stat-label { font-size: 14px; color: #666; }
          .transactions-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .transactions-table th, .transactions-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .transactions-table th { background-color: #f5f5f5; font-weight: bold; }
          .profit { font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; padding: 20px; border: 2px solid #333; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>${settings.companyName}</h1>
            ${settings.companyNif ? `<p>NIF: ${settings.companyNif}</p>` : ''}
          </div>
          <h2>${reportTitle}</h2>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-AO')} às ${new Date().toLocaleTimeString('pt-AO')}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value" style="color: #16a34a;">${formatCurrency(stats.totalVendas)}</div>
            <div class="stat-label">Total de Vendas</div>
            <div class="stat-label">${stats.quantidadeVendida} kg vendidos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #dc2626;">${formatCurrency(stats.totalCompras)}</div>
            <div class="stat-label">Total de Compras</div>
            <div class="stat-label">${stats.quantidadeComprada} kg comprados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #ea580c;">${formatCurrency(stats.totalFinanciamentos)}</div>
            <div class="stat-label">Total de Financiamentos</div>
            <div class="stat-label">${stats.quantidadeFinanciada} kg financiados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #2563eb;">${stats.totalRecolhas} kg</div>
            <div class="stat-label">Total de Recolhas</div>
            <div class="stat-label">${stats.quantidadeRecolhida} kg recolhidos</div>
          </div>
        </div>

        <div class="profit">
          Lucro Líquido: ${formatCurrency(stats.totalVendas - (stats.totalCompras + stats.totalFinanciamentos))}
          <br>
          <small>Margem: ${stats.totalVendas > 0 ? ((stats.totalVendas - (stats.totalCompras + stats.totalFinanciamentos)) / stats.totalVendas * 100).toFixed(1) : 0}%</small>
        </div>

        <h3>Transações do Período (${stats.totalTransactions})</h3>
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Parceiro</th>
              <th>Banco</th>
              <th>Café</th>
              <th>Quantidade</th>
              <th>Preço/kg</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${stats.transactions.map(transaction => {
              const partner = partners.find(p => p.id === transaction.partnerId)
              const bank = banks.find(b => b.id === transaction.bankId)
              return `
                <tr>
                  <td>${transaction.date}</td>
                  <td>${transaction.type}</td>
                  <td>${partner?.name || 'N/A'}</td>
                  <td>${bank?.name || 'N/A'}</td>
                  <td>${transaction.coffeeType === 'comercial' ? 'Comercial' : 'Côco'}</td>
                  <td>${transaction.quantity} kg</td>
                  <td>${formatCurrency(transaction.pricePerKg)}</td>
                  <td>${formatCurrency(transaction.amount)}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Relatório gerado pelo ${settings.companyName} - Sistema de Gestão de Café</p>
          <p>Este documento foi gerado automaticamente em ${new Date().toLocaleDateString('pt-AO')}</p>
        </div>
      </body>
      </html>
    `

    // Criar e baixar o arquivo
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Função para imprimir relatório
  const printReport = () => {
    const stats = getReportStats()
    const reportTitle = selectedReportType === 'personalizado' ? 'Relatório Personalizado' : 
      selectedReportType === 'semanal' ? 'Relatório Semanal' :
      selectedReportType === 'mensal' ? 'Relatório Mensal' : 'Relatório Anual'
    
    // Criar conteúdo HTML para impressão
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle} - ${settings.companyName}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company-info { margin-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px; }
          .stat-card { border: 1px solid #ddd; padding: 12px; border-radius: 5px; }
          .stat-value { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
          .stat-label { font-size: 12px; color: #666; }
          .transactions-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
          .transactions-table th, .transactions-table td { border: 1px solid #ddd; padding: 6px; text-align: left; }
          .transactions-table th { background-color: #f5f5f5; font-weight: bold; }
          .profit { font-size: 22px; font-weight: bold; text-align: center; margin: 15px 0; padding: 15px; border: 2px solid #333; }
          .footer { margin-top: 25px; text-align: center; font-size: 10px; color: #666; }
          h3 { margin-top: 25px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>${settings.companyName}</h1>
            ${settings.companyNif ? `<p>NIF: ${settings.companyNif}</p>` : ''}
          </div>
          <h2>${reportTitle}</h2>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-AO')} às ${new Date().toLocaleTimeString('pt-AO')}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${formatCurrency(stats.totalVendas)}</div>
            <div class="stat-label">Total de Vendas</div>
            <div class="stat-label">${stats.quantidadeVendida} kg vendidos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatCurrency(stats.totalCompras)}</div>
            <div class="stat-label">Total de Compras</div>
            <div class="stat-label">${stats.quantidadeComprada} kg comprados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatCurrency(stats.totalFinanciamentos)}</div>
            <div class="stat-label">Total de Financiamentos</div>
            <div class="stat-label">${stats.quantidadeFinanciada} kg financiados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.totalRecolhas} kg</div>
            <div class="stat-label">Total de Recolhas</div>
            <div class="stat-label">${stats.quantidadeRecolhida} kg recolhidos</div>
          </div>
        </div>

        <div class="profit">
          Lucro Líquido: ${formatCurrency(stats.totalVendas - (stats.totalCompras + stats.totalFinanciamentos))}
          <br>
          <small>Margem: ${stats.totalVendas > 0 ? ((stats.totalVendas - (stats.totalCompras + stats.totalFinanciamentos)) / stats.totalVendas * 100).toFixed(1) : 0}%</small>
        </div>

        <h3>Transações do Período (${stats.totalTransactions})</h3>
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Parceiro</th>
              <th>Banco</th>
              <th>Café</th>
              <th>Qtd (kg)</th>
              <th>Preço/kg</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${stats.transactions.map(transaction => {
              const partner = partners.find(p => p.id === transaction.partnerId)
              const bank = banks.find(b => b.id === transaction.bankId)
              return `
                <tr>
                  <td>${transaction.date}</td>
                  <td>${transaction.type}</td>
                  <td>${partner?.name || 'N/A'}</td>
                  <td>${bank?.name || 'N/A'}</td>
                  <td>${transaction.coffeeType === 'comercial' ? 'Comercial' : 'Côco'}</td>
                  <td>${transaction.quantity}</td>
                  <td>${formatCurrency(transaction.pricePerKg)}</td>
                  <td>${formatCurrency(transaction.amount)}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Relatório gerado pelo ${settings.companyName} - Sistema de Gestão de Café</p>
          <p>Este documento foi gerado automaticamente em ${new Date().toLocaleDateString('pt-AO')}</p>
        </div>
      </body>
      </html>
    `

    // Abrir nova janela para impressão
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      
      // Aguardar carregamento e imprimir
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
      }
    }
  }

  // Função para atualizar saldo do banco baseado na transação
  const updateBankBalance = (bankId: string, amount: number, transactionType: string, isReversal: boolean = false) => {
    setBanks(prevBanks => 
      prevBanks.map(bank => {
        if (bank.id === bankId) {
          let balanceChange = 0
          
          // Lógica para diferentes tipos de transação
          switch (transactionType) {
            case 'venda':
              // Vendas aumentam o saldo (entrada de dinheiro)
              balanceChange = isReversal ? -amount : amount
              break
            case 'compra':
              // Compras diminuem o saldo (saída de dinheiro)
              balanceChange = isReversal ? amount : -amount
              break
            case 'financiamento':
              // Financiamentos diminuem o saldo (saída de dinheiro)
              balanceChange = isReversal ? amount : -amount
              break
            case 'recolha':
              // Recolhas não afetam o saldo bancário (apenas movimentação física)
              balanceChange = 0
              break
            default:
              balanceChange = 0
          }
          
          return {
            ...bank,
            balance: bank.balance + balanceChange
          }
        }
        return bank
      })
    )
  }

  // Função para atualizar estoque de café
  const updateCoffeeStock = (quantity: number, transactionType: string, coffeeType: 'comercial' | 'coco', isReversal: boolean = false, financedQuantity?: number) => {
    setCoffeeStock(prevStock => {
      let stockChange = 0
      let comercialChange = 0
      let cocoChange = 0
      let financedChange = 0
      let financedComercialChange = 0
      let financedCocoChange = 0
      
      // Lógica para diferentes tipos de transação
      switch (transactionType) {
        case 'compra':
          // Compras aumentam o estoque de café
          stockChange = isReversal ? -quantity : quantity
          if (coffeeType === 'comercial') {
            comercialChange = isReversal ? -quantity : quantity
          } else {
            cocoChange = isReversal ? -quantity : quantity
          }
          break
        case 'venda':
          // Vendas diminuem o estoque de café
          stockChange = isReversal ? quantity : -quantity
          if (coffeeType === 'comercial') {
            comercialChange = isReversal ? quantity : -quantity
          } else {
            cocoChange = isReversal ? quantity : -quantity
          }
          break
        case 'recolha':
          // Recolhas aumentam o estoque de café e diminuem café financiado
          stockChange = isReversal ? -quantity : quantity
          if (coffeeType === 'comercial') {
            comercialChange = isReversal ? -quantity : quantity
          } else {
            cocoChange = isReversal ? -quantity : quantity
          }
          // Diminuir café financiado
          if (financedQuantity) {
            financedChange = isReversal ? financedQuantity : -financedQuantity
            if (coffeeType === 'comercial') {
              financedComercialChange = isReversal ? financedQuantity : -financedQuantity
            } else {
              financedCocoChange = isReversal ? financedQuantity : -financedQuantity
            }
          }
          break
        case 'financiamento':
          // Financiamentos aumentam café financiado (não afetam estoque físico)
          if (financedQuantity) {
            financedChange = isReversal ? -financedQuantity : financedQuantity
            if (coffeeType === 'comercial') {
              financedComercialChange = isReversal ? -financedQuantity : financedQuantity
            } else {
              financedCocoChange = isReversal ? -financedQuantity : financedQuantity
            }
          }
          break
        default:
          stockChange = 0
          comercialChange = 0
          cocoChange = 0
      }
      
      return {
        totalQuantity: Math.max(0, prevStock.totalQuantity + stockChange),
        comercialQuantity: Math.max(0, prevStock.comercialQuantity + comercialChange),
        cocoQuantity: Math.max(0, prevStock.cocoQuantity + cocoChange),
        financedQuantity: Math.max(0, prevStock.financedQuantity + financedChange),
        financedComercial: Math.max(0, prevStock.financedComercial + financedComercialChange),
        financedCoco: Math.max(0, prevStock.financedCoco + financedCocoChange),
        lastUpdated: new Date().toISOString()
      }
    })
  }

  // Funções para Parceiros
  const addPartner = () => {
    if (newPartner.name && newPartner.type && newPartner.email) {
      const partner: Partner = {
        id: Date.now().toString(),
        name: newPartner.name,
        type: newPartner.type as Partner['type'],
        email: newPartner.email,
        phone: newPartner.phone || '',
        address: newPartner.address || '',
        status: 'ativo'
      }
      setPartners([...partners, partner])
      setNewPartner({})
      setIsPartnerModalOpen(false)
    }
  }

  const editPartner = (partner: Partner) => {
    setEditingPartner(partner)
    setNewPartner(partner)
    setIsPartnerModalOpen(true)
  }

  const updatePartner = () => {
    if (editingPartner && newPartner.name && newPartner.type && newPartner.email) {
      const updatedPartner: Partner = {
        ...editingPartner,
        name: newPartner.name,
        type: newPartner.type as Partner['type'],
        email: newPartner.email,
        phone: newPartner.phone || '',
        address: newPartner.address || '',
        status: newPartner.status as Partner['status'] || 'ativo'
      }
      setPartners(partners.map(p => p.id === editingPartner.id ? updatedPartner : p))
      setNewPartner({})
      setEditingPartner(null)
      setIsPartnerModalOpen(false)
    }
  }

  const deletePartner = (partnerId: string) => {
    if (confirm('Tem certeza que deseja excluir este parceiro?')) {
      setPartners(partners.filter(p => p.id !== partnerId))
    }
  }

  // Funções para Bancos
  const addBank = () => {
    if (newBank.name && newBank.accountNumber) {
      const bank: Bank = {
        id: Date.now().toString(),
        name: newBank.name,
        accountNumber: newBank.accountNumber,
        iban: newBank.iban || '',
        swift: newBank.swift || '',
        balance: newBank.balance || 0
      }
      setBanks([...banks, bank])
      setNewBank({})
      setIsBankModalOpen(false)
    }
  }

  const editBank = (bank: Bank) => {
    setEditingBank(bank)
    setNewBank(bank)
    setIsBankModalOpen(true)
  }

  const updateBank = () => {
    if (editingBank && newBank.name && newBank.accountNumber) {
      const updatedBank: Bank = {
        ...editingBank,
        name: newBank.name,
        accountNumber: newBank.accountNumber,
        iban: newBank.iban || '',
        swift: newBank.swift || '',
        balance: newBank.balance || 0
      }
      setBanks(banks.map(b => b.id === editingBank.id ? updatedBank : b))
      setNewBank({})
      setEditingBank(null)
      setIsBankModalOpen(false)
    }
  }

  const deleteBank = (bankId: string) => {
    if (confirm('Tem certeza que deseja excluir este banco?')) {
      setBanks(banks.filter(b => b.id !== bankId))
    }
  }

  // Funções para Transações
  const addTransaction = () => {
    // Validação mais robusta dos campos obrigatórios
    if (!newTransaction.type) {
      alert('Por favor, selecione o tipo de transação')
      return
    }
    if (!newTransaction.partnerId) {
      alert('Por favor, selecione um parceiro')
      return
    }
    if (!newTransaction.bankId) {
      alert('Por favor, selecione um banco')
      return
    }
    if (!newTransaction.quantity || newTransaction.quantity <= 0) {
      alert('Por favor, insira uma quantidade válida')
      return
    }
    if (!newTransaction.date) {
      alert('Por favor, selecione uma data')
      return
    }
    if (!newTransaction.pricePerKg || newTransaction.pricePerKg <= 0) {
      alert('Por favor, insira um preço unitário válido')
      return
    }
    if (!newTransaction.coffeeType) {
      alert('Por favor, selecione o tipo de café')
      return
    }
    
    // Verificar se há estoque suficiente para vendas
    if (newTransaction.type === 'venda') {
      const currentStock = newTransaction.coffeeType === 'comercial' 
        ? coffeeStock.comercialQuantity 
        : coffeeStock.cocoQuantity
      
      if (newTransaction.quantity > currentStock) {
        alert(`Estoque insuficiente! Disponível: ${currentStock} kg de café ${newTransaction.coffeeType}`)
        return
      }
    }

    // Verificar se há café financiado suficiente para recolhas
    if (newTransaction.type === 'recolha') {
      const currentFinanced = newTransaction.coffeeType === 'comercial' 
        ? coffeeStock.financedComercial 
        : coffeeStock.financedCoco
      
      if (newTransaction.financedQuantity && newTransaction.financedQuantity > currentFinanced) {
        alert(`Café financiado insuficiente! Disponível: ${currentFinanced} kg de café ${newTransaction.coffeeType} financiado`)
        return
      }
    }
    
    // Calcular valor total automaticamente
    const totalAmount = calculateTotalAmount(newTransaction.quantity, newTransaction.pricePerKg)
    
    // Todos os campos obrigatórios estão preenchidos, criar a transação
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as Transaction['type'],
      partnerId: newTransaction.partnerId,
      bankId: newTransaction.bankId,
      amount: totalAmount,
      quantity: newTransaction.quantity,
      pricePerKg: newTransaction.pricePerKg,
      date: newTransaction.date,
      status: 'pendente',
      description: newTransaction.description || '',
      coffeeType: newTransaction.coffeeType as Transaction['coffeeType'],
      financedQuantity: newTransaction.financedQuantity || 0
    }
    
    // Atualizar saldo do banco
    updateBankBalance(transaction.bankId, transaction.amount, transaction.type)
    
    // Atualizar estoque de café
    updateCoffeeStock(transaction.quantity, transaction.type, transaction.coffeeType, false, transaction.financedQuantity)
    
    setTransactions([...transactions, transaction])
    setNewTransaction({})
    setIsTransactionModalOpen(false)
  }

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setNewTransaction(transaction)
    setIsTransactionModalOpen(true)
  }

  const updateTransaction = () => {
    // Validação mais robusta dos campos obrigatórios
    if (!newTransaction.type) {
      alert('Por favor, selecione o tipo de transação')
      return
    }
    if (!newTransaction.partnerId) {
      alert('Por favor, selecione um parceiro')
      return
    }
    if (!newTransaction.bankId) {
      alert('Por favor, selecione um banco')
      return
    }
    if (!newTransaction.quantity || newTransaction.quantity <= 0) {
      alert('Por favor, insira uma quantidade válida')
      return
    }
    if (!newTransaction.date) {
      alert('Por favor, selecione uma data')
      return
    }
    if (!newTransaction.pricePerKg || newTransaction.pricePerKg <= 0) {
      alert('Por favor, insira um preço unitário válido')
      return
    }
    if (!newTransaction.coffeeType) {
      alert('Por favor, selecione o tipo de café')
      return
    }
    
    if (!editingTransaction) {
      alert('Erro: Transação não encontrada para edição')
      return
    }
    
    // Reverter o efeito da transação anterior no saldo
    updateBankBalance(editingTransaction.bankId, editingTransaction.amount, editingTransaction.type, true)
    
    // Reverter o efeito da transação anterior no estoque
    updateCoffeeStock(editingTransaction.quantity, editingTransaction.type, editingTransaction.coffeeType, true, editingTransaction.financedQuantity)
    
    // Verificar se há estoque suficiente para vendas (após reverter a transação anterior)
    if (newTransaction.type === 'venda') {
      const currentStock = newTransaction.coffeeType === 'comercial' 
        ? coffeeStock.comercialQuantity 
        : coffeeStock.cocoQuantity
      
      if (newTransaction.quantity > currentStock) {
        // Reverter as mudanças já feitas
        updateBankBalance(editingTransaction.bankId, editingTransaction.amount, editingTransaction.type)
        updateCoffeeStock(editingTransaction.quantity, editingTransaction.type, editingTransaction.coffeeType, false, editingTransaction.financedQuantity)
        
        alert(`Estoque insuficiente! Disponível: ${currentStock} kg de café ${newTransaction.coffeeType}`)
        return
      }
    }

    // Verificar se há café financiado suficiente para recolhas
    if (newTransaction.type === 'recolha') {
      const currentFinanced = newTransaction.coffeeType === 'comercial' 
        ? coffeeStock.financedComercial 
        : coffeeStock.financedCoco
      
      if (newTransaction.financedQuantity && newTransaction.financedQuantity > currentFinanced) {
        // Reverter as mudanças já feitas
        updateBankBalance(editingTransaction.bankId, editingTransaction.amount, editingTransaction.type)
        updateCoffeeStock(editingTransaction.quantity, editingTransaction.type, editingTransaction.coffeeType, false, editingTransaction.financedQuantity)
        
        alert(`Café financiado insuficiente! Disponível: ${currentFinanced} kg de café ${newTransaction.coffeeType} financiado`)
        return
      }
    }
    
    // Calcular valor total automaticamente
    const totalAmount = calculateTotalAmount(newTransaction.quantity, newTransaction.pricePerKg)
    
    const updatedTransaction: Transaction = {
      ...editingTransaction,
      type: newTransaction.type as Transaction['type'],
      partnerId: newTransaction.partnerId,
      bankId: newTransaction.bankId,
      amount: totalAmount,
      quantity: newTransaction.quantity,
      pricePerKg: newTransaction.pricePerKg || 0,
      date: newTransaction.date || editingTransaction.date,
      status: newTransaction.status as Transaction['status'] || 'pendente',
      description: newTransaction.description || '',
      coffeeType: newTransaction.coffeeType as Transaction['coffeeType'] || editingTransaction.coffeeType,
      financedQuantity: newTransaction.financedQuantity || 0
    }
    
    // Aplicar o efeito da nova transação no saldo
    updateBankBalance(updatedTransaction.bankId, updatedTransaction.amount, updatedTransaction.type)
    
    // Aplicar o efeito da nova transação no estoque
    updateCoffeeStock(updatedTransaction.quantity, updatedTransaction.type, updatedTransaction.coffeeType, false, updatedTransaction.financedQuantity)
    
    setTransactions(transactions.map(t => t.id === editingTransaction.id ? updatedTransaction : t))
    setNewTransaction({})
    setEditingTransaction(null)
    setIsTransactionModalOpen(false)
  }

  const deleteTransaction = (transactionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      const transaction = transactions.find(t => t.id === transactionId)
      if (transaction) {
        // Reverter o efeito da transação no saldo do banco
        updateBankBalance(transaction.bankId, transaction.amount, transaction.type, true)
        
        // Reverter o efeito da transação no estoque
        updateCoffeeStock(transaction.quantity, transaction.type, transaction.coffeeType, true, transaction.financedQuantity)
      }
      setTransactions(transactions.filter(t => t.id !== transactionId))
    }
  }

  // Função para fechar modais e limpar estados
  const closeModal = (modalType: 'partner' | 'bank' | 'transaction') => {
    switch (modalType) {
      case 'partner':
        setIsPartnerModalOpen(false)
        setEditingPartner(null)
        setNewPartner({})
        break
      case 'bank':
        setIsBankModalOpen(false)
        setEditingBank(null)
        setNewBank({})
        break
      case 'transaction':
        setIsTransactionModalOpen(false)
        setEditingTransaction(null)
        setNewTransaction({})
        break
    }
  }

  // Cálculos para dashboard
  const totalVendas = transactions.filter(t => t.type === 'venda').reduce((sum, t) => sum + t.amount, 0)
  const totalCompras = transactions.filter(t => t.type === 'compra').reduce((sum, t) => sum + t.amount, 0)
  const totalFinanciamento = transactions.filter(t => t.type === 'financiamento').reduce((sum, t) => sum + t.amount, 0)
  const totalRecolha = transactions.filter(t => t.type === 'recolha').reduce((sum, t) => sum + t.quantity, 0)

  return (
    <div className={`min-h-screen ${settings.backgroundColor}`}>
      {/* Header */}
      <header className={`bg-gradient-to-r ${settings.primaryColor} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coffee className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{settings.companyName}</h1>
                {settings.companyNif && (
                  <p className="text-sm opacity-90">NIF: {settings.companyNif}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currencies.find(c => c.code === settings.currency)?.name}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Transações</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Parceiros</span>
            </TabsTrigger>
            <TabsTrigger value="banks" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Bancos</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Estoque</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalVendas)}</div>
                  <p className="text-xs text-muted-foreground">
                    ↗ Aumenta saldo | ↘ Diminui estoque
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCompras)}</div>
                  <p className="text-xs text-muted-foreground">
                    ↘ Diminui saldo | ↗ Aumenta estoque
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Financiamentos</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalFinanciamento)}</div>
                  <p className="text-xs text-muted-foreground">
                    ↘ Diminui saldo bancário
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Café Recolhido</CardTitle>
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{totalRecolha.toLocaleString()} kg</div>
                  <p className="text-xs text-muted-foreground">
                    ↗ Aumenta estoque | ↘ Diminui financiado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Total</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{coffeeStock.totalQuantity.toLocaleString()} kg</div>
                  <p className="text-xs text-muted-foreground">
                    Comercial: {coffeeStock.comercialQuantity} kg | Côco: {coffeeStock.cocoQuantity} kg
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Café Financiado</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{coffeeStock.financedQuantity.toLocaleString()} kg</div>
                  <p className="text-xs text-muted-foreground">
                    Comercial: {coffeeStock.financedComercial} kg | Côco: {coffeeStock.financedCoco} kg
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>Últimas movimentações e seus efeitos no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma transação registrada ainda
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {transactions.slice(-5).map((transaction) => {
                        const partner = partners.find(p => p.id === transaction.partnerId)
                        const bank = banks.find(b => b.id === transaction.bankId)
                        
                        // Determinar o efeito da transação
                        let effect = ''
                        let effectColor = ''
                        switch (transaction.type) {
                          case 'venda':
                            effect = '↗ Saldo | ↘ Estoque'
                            effectColor = 'text-green-600'
                            break
                          case 'compra':
                            effect = '↘ Saldo | ↗ Estoque'
                            effectColor = 'text-red-600'
                            break
                          case 'financiamento':
                            effect = '↘ Diminui saldo | ↗ Aumenta financiado'
                            effectColor = 'text-orange-600'
                            break
                          case 'recolha':
                            effect = '📦 Aumenta estoque | ↘ Diminui financiado'
                            effectColor = 'text-blue-600'
                            break
                        }
                        
                        return (
                          <div key={transaction.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{partner?.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {transaction.type} - {bank?.name} - {transaction.status}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.coffeeType === 'comercial' ? 'Café Comercial' : 'Café Côco'} - {formatCurrency(transaction.pricePerKg)}/kg - {transaction.quantity} kg
                              </p>
                              <p className={`text-xs ${effectColor}`}>{effect}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                              <p className="text-sm text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Estoque e Financiamento</CardTitle>
                  <CardDescription>Distribuição do café disponível e financiado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Estoque Físico</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Café Comercial</span>
                          <Badge variant="secondary">
                            {coffeeStock.comercialQuantity.toLocaleString()} kg
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Café Côco</span>
                          <Badge variant="secondary">
                            {coffeeStock.cocoQuantity.toLocaleString()} kg
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Café Financiado (Por Recolher)</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Comercial Financiado</span>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            {coffeeStock.financedComercial.toLocaleString()} kg
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Côco Financiado</span>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            {coffeeStock.financedCoco.toLocaleString()} kg
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total Disponível</span>
                      <Badge variant="default">
                        {coffeeStock.totalQuantity.toLocaleString()} kg
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span>Total Financiado</span>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        {coffeeStock.financedQuantity.toLocaleString()} kg
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Controle de Estoque</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estoque Total</CardTitle>
                  <CardDescription>Quantidade total de café disponível</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600 mb-2">
                      {coffeeStock.totalQuantity.toLocaleString()} kg
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Última atualização: {new Date(coffeeStock.lastUpdated).toLocaleDateString('pt-AO')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Café Comercial</CardTitle>
                  <CardDescription>Estoque de café comercial</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600 mb-2">
                      {coffeeStock.comercialQuantity.toLocaleString()} kg
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {((coffeeStock.comercialQuantity / coffeeStock.totalQuantity) * 100 || 0).toFixed(1)}% do total
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Café Côco</CardTitle>
                  <CardDescription>Estoque de café côco</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-amber-600 mb-2">
                      {coffeeStock.cocoQuantity.toLocaleString()} kg
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {((coffeeStock.cocoQuantity / coffeeStock.totalQuantity) * 100 || 0).toFixed(1)}% do total
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Café Financiado</CardTitle>
                  <CardDescription>Quantidade por recolher</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-orange-600 mb-2">
                      {coffeeStock.financedQuantity.toLocaleString()} kg
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Comercial: {coffeeStock.financedComercial} kg | Côco: {coffeeStock.financedCoco} kg
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status do Estoque</CardTitle>
                <CardDescription>Situação atual do estoque e café financiado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Estoque Físico Disponível</h4>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg border ${
                        coffeeStock.totalQuantity > 1000 
                          ? 'bg-green-50 border-green-200' 
                          : coffeeStock.totalQuantity > 500 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Status Geral</span>
                          <Badge variant={
                            coffeeStock.totalQuantity > 1000 ? 'default' :
                            coffeeStock.totalQuantity > 500 ? 'secondary' : 'destructive'
                          }>
                            {coffeeStock.totalQuantity > 1000 
                              ? '✅ Estoque Alto' 
                              : coffeeStock.totalQuantity > 500 
                              ? '⚠️ Estoque Médio' 
                              : '🔴 Estoque Baixo'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {coffeeStock.totalQuantity > 1000 
                            ? 'Estoque em bom nível para operações' 
                            : coffeeStock.totalQuantity > 500 
                            ? 'Considere novas compras ou recolhas' 
                            : 'Necessário recolher café financiado ou fazer novas compras'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Café Financiado (Por Recolher)</h4>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg border ${
                        coffeeStock.financedQuantity > 0 
                          ? 'bg-amber-50 border-amber-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Pendente de Recolha</span>
                          <Badge variant={coffeeStock.financedQuantity > 0 ? 'secondary' : 'outline'}>
                            {coffeeStock.financedQuantity > 0 
                              ? `${coffeeStock.financedQuantity} kg pendentes` 
                              : 'Nenhum pendente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {coffeeStock.financedQuantity > 0 
                            ? 'Há café financiado aguardando recolha' 
                            : 'Não há café financiado pendente'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Movimentações de Estoque</CardTitle>
                <CardDescription>Todas as operações que afetaram o estoque de café</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.filter(t => ['compra', 'venda', 'recolha'].includes(t.type)).length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma movimentação de estoque registrada ainda</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Compras e recolhas aumentam o estoque | Vendas diminuem o estoque
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.filter(t => ['compra', 'venda', 'recolha'].includes(t.type)).map((transaction) => {
                      const partner = partners.find(p => p.id === transaction.partnerId)
                      const bank = banks.find(b => b.id === transaction.bankId)
                      
                      let effectText = ''
                      let effectColor = ''
                      let bgColor = ''
                      
                      switch (transaction.type) {
                        case 'venda':
                          effectText = '↘ Diminuiu estoque'
                          effectColor = 'text-red-600'
                          bgColor = 'bg-red-50'
                          break
                        case 'compra':
                          effectText = '↗ Aumentou estoque'
                          effectColor = 'text-green-600'
                          bgColor = 'bg-green-50'
                          break
                        case 'recolha':
                          effectText = '📦 Aumentou estoque | ↘ Diminuiu financiado'
                          effectColor = 'text-blue-600'
                          bgColor = 'bg-blue-50'
                          break
                      }
                      
                      return (
                        <div key={transaction.id} className={`flex items-center justify-between p-4 border rounded-lg ${bgColor}`}>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant={transaction.type === 'venda' ? 'destructive' : 'default'}>
                                {transaction.type}
                              </Badge>
                              <span className="font-medium">{partner?.name}</span>
                              <Badge variant="outline">
                                {bank?.name}
                              </Badge>
                              <Badge variant={transaction.status === 'concluida' ? 'default' : transaction.status === 'pendente' ? 'secondary' : 'destructive'}>
                                {transaction.status}
                              </Badge>
                              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                {transaction.coffeeType === 'comercial' ? 'Comercial' : 'Côco'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {transaction.description} - {transaction.date}
                            </p>
                            <p className={`text-sm font-medium ${effectColor}`}>
                              {effectText} - {transaction.quantity} kg - {formatCurrency(transaction.pricePerKg)}/kg
                            </p>
                            {transaction.financedQuantity && transaction.financedQuantity > 0 && (
                              <p className="text-xs text-amber-600">
                                Café financiado recolhido: {transaction.financedQuantity} kg
                              </p>
                            )}
                          </div>
                          <div className="text-right mr-4">
                            <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                            <p className={`text-sm font-medium ${effectColor}`}>
                              {transaction.type === 'venda' ? '-' : '+'}{transaction.quantity} kg
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Gestão de Transações</h2>
              <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
                <DialogTrigger asChild>
                  <Button className={`bg-gradient-to-r ${settings.primaryColor}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Transação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTransaction ? 'Editar Transação' : 'Adicionar Nova Transação'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTransaction ? 'Modifique os dados da transação' : 'Registre uma nova operação de café'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Tipo de Transação</Label>
                        <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value as Transaction['type']})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compra">Compra (↘ Saldo | ↗ Estoque)</SelectItem>
                            <SelectItem value="venda">Venda (↗ Saldo | ↘ Estoque)</SelectItem>
                            <SelectItem value="financiamento">Financiamento (↘ Saldo | ↗ Financiado)</SelectItem>
                            <SelectItem value="recolha">Recolha (↗ Estoque | ↘ Financiado)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="partner">Parceiro</Label>
                        <Select value={newTransaction.partnerId} onValueChange={(value) => setNewTransaction({...newTransaction, partnerId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o parceiro" />
                          </SelectTrigger>
                          <SelectContent>
                            {partners.map((partner) => (
                              <SelectItem key={partner.id} value={partner.id}>
                                {partner.name} ({partner.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bank">Banco</Label>
                      <Select value={newTransaction.bankId} onValueChange={(value) => setNewTransaction({...newTransaction, bankId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.name} - {bank.accountNumber} (Saldo: {formatCurrency(bank.balance)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date">Data da Transação</Label>
                        <Input
                          type="date"
                          value={newTransaction.date || ''}
                          onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricePerKg">Preço Unitário (por kg)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newTransaction.pricePerKg || ''}
                          onChange={(e) => setNewTransaction({...newTransaction, pricePerKg: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="coffeeType">Tipo de Café</Label>
                        <Select value={newTransaction.coffeeType} onValueChange={(value) => setNewTransaction({...newTransaction, coffeeType: value as Transaction['coffeeType']})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comercial">Comercial (Disponível: {coffeeStock.comercialQuantity} kg)</SelectItem>
                            <SelectItem value="coco">Côco (Disponível: {coffeeStock.cocoQuantity} kg)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantidade (kg)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newTransaction.quantity || ''}
                          onChange={(e) => setNewTransaction({...newTransaction, quantity: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Valor Total (Calculado Automaticamente)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newTransaction.amount || ''}
                          readOnly
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {newTransaction.quantity && newTransaction.pricePerKg 
                            ? `${newTransaction.quantity} kg × ${formatCurrency(newTransaction.pricePerKg)} = ${formatCurrency(newTransaction.quantity * newTransaction.pricePerKg)}`
                            : 'Insira quantidade e preço unitário'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Campo específico para recolhas */}
                    {newTransaction.type === 'recolha' && (
                      <div>
                        <Label htmlFor="financedQuantity">Quantidade de Café Financiado a Recolher (kg)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newTransaction.financedQuantity || ''}
                          onChange={(e) => setNewTransaction({...newTransaction, financedQuantity: parseFloat(e.target.value)})}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Disponível para recolha: {newTransaction.coffeeType === 'comercial' ? coffeeStock.financedComercial : coffeeStock.financedCoco} kg de café {newTransaction.coffeeType} financiado
                        </p>
                      </div>
                    )}

                    {/* Campo específico para financiamentos */}
                    {newTransaction.type === 'financiamento' && (
                      <div>
                        <Label htmlFor="financedQuantity">Quantidade de Café Financiado (kg)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newTransaction.financedQuantity || ''}
                          onChange={(e) => setNewTransaction({...newTransaction, financedQuantity: parseFloat(e.target.value)})}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Quantidade de café que será financiada para posterior recolha
                        </p>
                      </div>
                    )}

                    {editingTransaction && (
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={newTransaction.status} onValueChange={(value) => setNewTransaction({...newTransaction, status: value as Transaction['status']})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        placeholder="Descrição da transação"
                        value={newTransaction.description || ''}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      />
                    </div>
                    
                    {/* Informação sobre o efeito da transação */}
                    {newTransaction.type && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          Efeito desta transação:
                        </p>
                        <p className="text-sm text-blue-600">
                          {newTransaction.type === 'venda' && '↗ Aumentará o saldo do banco | ↘ Diminuirá o estoque de café'}
                          {newTransaction.type === 'compra' && '↘ Diminuirá o saldo do banco | ↗ Aumentará o estoque de café'}
                          {newTransaction.type === 'financiamento' && '↘ Diminuirá o saldo do banco | ↗ Aumentará café financiado'}
                          {newTransaction.type === 'recolha' && '📦 Aumentará o estoque de café | ↘ Diminuirá café financiado'}
                        </p>
                        {newTransaction.type === 'venda' && newTransaction.coffeeType && (
                          <p className="text-xs text-blue-500 mt-1">
                            Estoque disponível de {newTransaction.coffeeType}: {newTransaction.coffeeType === 'comercial' ? coffeeStock.comercialQuantity : coffeeStock.cocoQuantity} kg
                          </p>
                        )}
                        {newTransaction.type === 'recolha' && newTransaction.coffeeType && (
                          <p className="text-xs text-blue-500 mt-1">
                            Café financiado disponível de {newTransaction.coffeeType}: {newTransaction.coffeeType === 'comercial' ? coffeeStock.financedComercial : coffeeStock.financedCoco} kg
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => closeModal('transaction')}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={editingTransaction ? updateTransaction : addTransaction} 
                      className={`bg-gradient-to-r ${settings.primaryColor}`}
                    >
                      {editingTransaction ? 'Atualizar' : 'Adicionar'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Transações</CardTitle>
                <CardDescription>Todas as operações registradas no sistema com seus efeitos</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma transação registrada ainda</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Clique em "Nova Transação" para começar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => {
                      const partner = partners.find(p => p.id === transaction.partnerId)
                      const bank = banks.find(b => b.id === transaction.bankId)
                      
                      // Determinar o efeito e cor da transação
                      let effectText = ''
                      let effectColor = ''
                      let bgColor = ''
                      
                      switch (transaction.type) {
                        case 'venda':
                          effectText = '↗ Aumentou saldo | ↘ Diminuiu estoque'
                          effectColor = 'text-green-600'
                          bgColor = 'bg-green-50'
                          break
                        case 'compra':
                          effectText = '↘ Diminuiu saldo | ↗ Aumentou estoque'
                          effectColor = 'text-red-600'
                          bgColor = 'bg-red-50'
                          break
                        case 'financiamento':
                          effectText = '↘ Diminuiu saldo | ↗ Aumentou financiado'
                          effectColor = 'text-orange-600'
                          bgColor = 'bg-orange-50'
                          break
                        case 'recolha':
                          effectText = '📦 Aumentou estoque | ↘ Diminuiu financiado'
                          effectColor = 'text-blue-600'
                          bgColor = 'bg-blue-50'
                          break
                      }
                      
                      return (
                        <div key={transaction.id} className={`flex items-center justify-between p-4 border rounded-lg ${bgColor}`}>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <Badge variant={transaction.type === 'venda' ? 'default' : 'secondary'}>
                                {transaction.type}
                              </Badge>
                              <span className="font-medium">{partner?.name}</span>
                              <Badge variant="outline">
                                {bank?.name}
                              </Badge>
                              <Badge variant={transaction.status === 'concluida' ? 'default' : transaction.status === 'pendente' ? 'secondary' : 'destructive'}>
                                {transaction.status}
                              </Badge>
                              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                {transaction.coffeeType === 'comercial' ? 'Comercial' : 'Côco'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {transaction.description} - {transaction.date}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Preço unitário: {formatCurrency(transaction.pricePerKg)}/kg | Quantidade: {transaction.quantity} kg
                            </p>
                            {transaction.financedQuantity && transaction.financedQuantity > 0 && (
                              <p className="text-xs text-amber-600">
                                Café financiado: {transaction.financedQuantity} kg
                              </p>
                            )}
                            <p className={`text-sm font-medium ${effectColor}`}>
                              {effectText}
                            </p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.quantity} kg
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => editTransaction(transaction)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteTransaction(transaction.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Gestão de Parceiros</h2>
              <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
                <DialogTrigger asChild>
                  <Button className={`bg-gradient-to-r ${settings.primaryColor}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Parceiro
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPartner ? 'Editar Parceiro' : 'Adicionar Novo Parceiro'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPartner ? 'Modifique os dados do parceiro' : 'Cadastre um novo colaborador, cliente ou fornecedor'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          placeholder="Nome completo"
                          value={newPartner.name || ''}
                          onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={newPartner.type} onValueChange={(value) => setNewPartner({...newPartner, type: value as Partner['type']})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="colaborador">Colaborador</SelectItem>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="fornecedor">Fornecedor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={newPartner.email || ''}
                          onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          placeholder="+244 923 456 789"
                          value={newPartner.phone || ''}
                          onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        placeholder="Endereço completo"
                        value={newPartner.address || ''}
                        onChange={(e) => setNewPartner({...newPartner, address: e.target.value})}
                      />
                    </div>
                    {editingPartner && (
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={newPartner.status} onValueChange={(value) => setNewPartner({...newPartner, status: value as Partner['status']})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => closeModal('partner')}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={editingPartner ? updatePartner : addPartner} 
                      className={`bg-gradient-to-r ${settings.primaryColor}`}
                    >
                      {editingPartner ? 'Atualizar' : 'Adicionar'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <Card key={partner.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <Badge variant={partner.type === 'fornecedor' ? 'default' : 'secondary'}>
                        {partner.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Email:</strong> {partner.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Telefone:</strong> {partner.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Endereço:</strong> {partner.address}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant={partner.status === 'ativo' ? 'default' : 'secondary'}>
                          {partner.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => editPartner(partner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deletePartner(partner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Banks Tab */}
          <TabsContent value="banks" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Gestão de Bancos</h2>
              <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
                <DialogTrigger asChild>
                  <Button className={`bg-gradient-to-r ${settings.primaryColor}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Banco
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBank ? 'Editar Conta Bancária' : 'Adicionar Nova Conta Bancária'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingBank ? 'Modifique os dados da conta bancária' : 'Cadastre uma nova conta bancária para o sistema'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="bankName">Nome do Banco</Label>
                      <Input
                        placeholder="Ex: Banco BAI"
                        value={newBank.name || ''}
                        onChange={(e) => setNewBank({...newBank, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountNumber">Número da Conta</Label>
                        <Input
                          placeholder="123456789"
                          value={newBank.accountNumber || ''}
                          onChange={(e) => setNewBank({...newBank, accountNumber: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="balance">Saldo</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newBank.balance || ''}
                          onChange={(e) => setNewBank({...newBank, balance: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="iban">IBAN</Label>
                        <Input
                          placeholder="AO06000000123456789"
                          value={newBank.iban || ''}
                          onChange={(e) => setNewBank({...newBank, iban: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="swift">SWIFT</Label>
                        <Input
                          placeholder="BAIAAOAO"
                          value={newBank.swift || ''}
                          onChange={(e) => setNewBank({...newBank, swift: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => closeModal('bank')}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={editingBank ? updateBank : addBank} 
                      className={`bg-gradient-to-r ${settings.primaryColor}`}
                    >
                      {editingBank ? 'Atualizar' : 'Adicionar'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banks.map((bank) => (
                <Card key={bank.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bank.name}</CardTitle>
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Número da Conta</p>
                        <p className="font-medium">{bank.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Saldo Atual</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(bank.balance)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Atualizado automaticamente pelas transações
                        </p>
                      </div>
                      {bank.iban && (
                        <div>
                          <p className="text-sm text-muted-foreground">IBAN</p>
                          <p className="font-mono text-sm">{bank.iban}</p>
                        </div>
                      )}
                      {bank.swift && (
                        <div>
                          <p className="text-sm text-muted-foreground">SWIFT</p>
                          <p className="font-mono text-sm">{bank.swift}</p>
                        </div>
                      )}
                      <div className="flex justify-end space-x-1 pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => editBank(bank)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteBank(bank.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Relatórios</h2>
              <div className="flex space-x-2">
                <Dialog open={isFiltersModalOpen} onOpenChange={setIsFiltersModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Filtros de Relatório</DialogTitle>
                      <DialogDescription>
                        Configure os filtros para personalizar seu relatório
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateFrom">Data Inicial</Label>
                          <Input
                            type="date"
                            value={reportFilters.dateFrom}
                            onChange={(e) => setReportFilters({...reportFilters, dateFrom: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateTo">Data Final</Label>
                          <Input
                            type="date"
                            value={reportFilters.dateTo}
                            onChange={(e) => setReportFilters({...reportFilters, dateTo: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="transactionType">Tipo de Transação</Label>
                        <Select value={reportFilters.transactionType} onValueChange={(value) => setReportFilters({...reportFilters, transactionType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos os tipos</SelectItem>
                            <SelectItem value="venda">Vendas</SelectItem>
                            <SelectItem value="compra">Compras</SelectItem>
                            <SelectItem value="financiamento">Financiamentos</SelectItem>
                            <SelectItem value="recolha">Recolhas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="partnerId">Parceiro</Label>
                        <Select value={reportFilters.partnerId} onValueChange={(value) => setReportFilters({...reportFilters, partnerId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os parceiros" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos os parceiros</SelectItem>
                            {partners.map((partner) => (
                              <SelectItem key={partner.id} value={partner.id}>
                                {partner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bankId">Banco</Label>
                        <Select value={reportFilters.bankId} onValueChange={(value) => setReportFilters({...reportFilters, bankId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os bancos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos os bancos</SelectItem>
                            {banks.map((bank) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="coffeeType">Tipo de Café</Label>
                        <Select value={reportFilters.coffeeType} onValueChange={(value) => setReportFilters({...reportFilters, coffeeType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos os tipos</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="coco">Côco</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Limpar
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedReportType('personalizado')
                          setIsFiltersModalOpen(false)
                          setIsReportModalOpen(true)
                        }}
                        className={`bg-gradient-to-r ${settings.primaryColor}`}
                      >
                        Aplicar Filtros
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openReport('semanal')}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Relatório Semanal</CardTitle>
                  <CardDescription>Resumo dos últimos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Calendar className="h-8 w-8 text-green-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">7 Dias</p>
                      <p className="text-sm text-muted-foreground">
                        Semana atual
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openReport('mensal')}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Relatório Mensal</CardTitle>
                  <CardDescription>Dados do mês corrente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Calendar className="h-8 w-8 text-orange-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">Mês</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('pt-AO', { month: 'long' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openReport('anual')}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Relatório Anual</CardTitle>
                  <CardDescription>Balanço do ano</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Calendar className="h-8 w-8 text-purple-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold">{new Date().getFullYear()}</p>
                      <p className="text-sm text-muted-foreground">
                        Ano corrente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Relatório por Tipo de Café</CardTitle>
                  <CardDescription>Análise por tipo de café</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Comercial:</span>
                      <span className="text-sm font-medium">{coffeeStock.comercialQuantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Côco:</span>
                      <span className="text-sm font-medium">{coffeeStock.cocoQuantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Financiado:</span>
                      <span className="text-sm font-medium">{coffeeStock.financedQuantity} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Geral por Tipo de Café</CardTitle>
                <CardDescription>Análise detalhada das operações por tipo de café</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Café Comercial</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Estoque atual:</span>
                        <span className="font-medium">{coffeeStock.comercialQuantity} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financiado (por recolher):</span>
                        <span className="font-medium text-amber-600">{coffeeStock.financedComercial} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendas (Comercial):</span>
                        <span className="font-medium">
                          {transactions.filter(t => t.type === 'venda' && t.coffeeType === 'comercial').reduce((sum, t) => sum + t.quantity, 0)} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compras (Comercial):</span>
                        <span className="font-medium">
                          {transactions.filter(t => t.type === 'compra' && t.coffeeType === 'comercial').reduce((sum, t) => sum + t.quantity, 0)} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recolhas (Comercial):</span>
                        <span className="font-medium">
                          {transactions.filter(t => t.type === 'recolha' && t.coffeeType === 'comercial').reduce((sum, t) => sum + t.quantity, 0)} kg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Café Côco</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Estoque atual:</span>
                        <span className="font-medium">{coffeeStock.cocoQuantity} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financiado (por recolher):</span>
                        <span className="font-medium text-amber-600">{coffeeStock.financedCoco} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendas (Côco):</span>
                        <span className="font-medium">
                          {transactions.filter(t => t.type === 'venda' && t.coffeeType === 'coco').reduce((sum, t) => sum + t.quantity, 0)} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compras (Côco):</span>
                        <span className="font-medium">
                          {transactions.filter(t => t.type === 'compra' && t.coffeeType === 'coco').reduce((sum, t) => sum + t.quantity, 0)} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recolhas (Côco):</span>
                        <span className="font-medium">
                          {transactions.filter(t => t.type === 'recolha' && t.coffeeType === 'coco').reduce((sum, t) => sum + t.quantity, 0)} kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <h2 className="text-2xl font-bold">Gestão Financeira</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receitas</CardTitle>
                  <CardDescription>Total de entradas (vendas)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(totalVendas)}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    ↗ Aumentam saldo | ↘ Diminuem estoque
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Despesas</CardTitle>
                  <CardDescription>Total de saídas (compras + financiamentos)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">
                    {formatCurrency(totalCompras + totalFinanciamento)}
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    ↘ Diminuem saldo | ↗ Aumentam estoque (compras)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lucro Líquido</CardTitle>
                  <CardDescription>Receitas - Despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(totalVendas - (totalCompras + totalFinanciamento))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Margem de {totalVendas > 0 ? ((totalVendas - (totalCompras + totalFinanciamento)) / totalVendas * 100).toFixed(1) : 0}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Saldos Bancários</CardTitle>
                <CardDescription>Posição atual das contas (atualizada automaticamente pelas transações)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banks.map((bank) => (
                    <div key={bank.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{bank.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Conta: {bank.accountNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(bank.balance)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Atualizado automaticamente
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Total Disponível</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(banks.reduce((sum, bank) => sum + bank.balance, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo dos Efeitos das Transações</CardTitle>
                <CardDescription>Como cada tipo de transação afeta o sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Efeitos no Saldo Bancário:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Vendas</span>
                        <span className="text-sm text-green-600 font-medium">↗ Aumentam saldo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">Compras</span>
                        <span className="text-sm text-red-600 font-medium">↘ Diminuem saldo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <span className="text-sm">Financiamentos</span>
                        <span className="text-sm text-orange-600 font-medium">↘ Diminuem saldo</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Recolhas</span>
                        <span className="text-sm text-gray-600 font-medium">— Não afetam saldo</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Efeitos no Estoque:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Compras</span>
                        <span className="text-sm text-green-600 font-medium">📦 Aumentam estoque</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">Vendas</span>
                        <span className="text-sm text-red-600 font-medium">📦 Diminuem estoque</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">Recolhas</span>
                        <span className="text-sm text-blue-600 font-medium">📦 Aumentam estoque | ↘ Diminuem financiado</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                        <span className="text-sm">Financiamentos</span>
                        <span className="text-sm text-amber-600 font-medium">↗ Aumentam financiado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Relatório {selectedReportType === 'personalizado' ? 'Personalizado' : 
                selectedReportType === 'semanal' ? 'Semanal' :
                selectedReportType === 'mensal' ? 'Mensal' : 'Anual'}
            </DialogTitle>
            <DialogDescription>
              {selectedReportType === 'personalizado' ? 'Relatório com filtros personalizados' :
                selectedReportType === 'semanal' ? 'Dados dos últimos 7 dias' :
                selectedReportType === 'mensal' ? 'Dados do último mês' : 'Dados do último ano'}
            </DialogDescription>
          </DialogHeader>
          
          {(() => {
            const stats = getReportStats()
            return (
              <div className="space-y-6">
                {/* Estatísticas Resumidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalVendas)}</p>
                    <p className="text-sm text-green-600">Vendas</p>
                    <p className="text-xs text-muted-foreground">{stats.quantidadeVendida} kg</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalCompras)}</p>
                    <p className="text-sm text-red-600">Compras</p>
                    <p className="text-xs text-muted-foreground">{stats.quantidadeComprada} kg</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalFinanciamentos)}</p>
                    <p className="text-sm text-orange-600">Financiamentos</p>
                    <p className="text-xs text-muted-foreground">{stats.quantidadeFinanciada} kg financiados</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalRecolhas} kg</p>
                    <p className="text-sm text-blue-600">Recolhas</p>
                    <p className="text-xs text-muted-foreground">{stats.quantidadeRecolhida} kg recolhidos</p>
                  </div>
                </div>

                {/* Lucro Líquido */}
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {formatCurrency(stats.totalVendas - (stats.totalCompras + stats.totalFinanciamentos))}
                  </p>
                  <p className="text-sm text-purple-600">Lucro Líquido do Período</p>
                  <p className="text-xs text-muted-foreground">
                    Margem: {stats.totalVendas > 0 ? ((stats.totalVendas - (stats.totalCompras + stats.totalFinanciamentos)) / stats.totalVendas * 100).toFixed(1) : 0}%
                  </p>
                </div>

                {/* Lista de Transações */}
                <div>
                  <h4 className="font-semibold mb-4">Transações do Período ({stats.totalTransactions})</h4>
                  {stats.transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma transação encontrada para os filtros selecionados
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {stats.transactions.map((transaction) => {
                        const partner = partners.find(p => p.id === transaction.partnerId)
                        const bank = banks.find(b => b.id === transaction.bankId)
                        
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant={transaction.type === 'venda' ? 'default' : 'secondary'}>
                                  {transaction.type}
                                </Badge>
                                <span className="font-medium text-sm">{partner?.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {bank?.name}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {transaction.coffeeType === 'comercial' ? 'Comercial' : 'Côco'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {transaction.date} - {transaction.quantity} kg - {formatCurrency(transaction.pricePerKg)}/kg
                              </p>
                              {transaction.financedQuantity && transaction.financedQuantity > 0 && (
                                <p className="text-xs text-amber-600">
                                  Café financiado: {transaction.financedQuantity} kg
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">{formatCurrency(transaction.amount)}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
              Fechar
            </Button>
            <Button 
              onClick={printReport}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button 
              onClick={downloadReportPDF}
              className={`bg-gradient-to-r ${settings.primaryColor}`}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurações do Sistema</DialogTitle>
            <DialogDescription>
              Personalize as configurações gerais do sistema
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  placeholder="Nome da sua empresa"
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="companyNif">NIF da Empresa</Label>
                <Input
                  placeholder="Ex: 5417000000"
                  value={settings.companyNif}
                  onChange={(e) => setSettings({...settings, companyNif: e.target.value})}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Número de Identificação Fiscal (opcional)
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="currency">Moeda Principal</Label>
              <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Moeda utilizada em todas as transações e relatórios
              </p>
            </div>

            <div>
              <Label htmlFor="primaryColor">Cor Principal do Sistema</Label>
              <div className="grid grid-cols-1 gap-3 mt-2 max-h-60 overflow-y-auto">
                {colors.map((color) => (
                  <div
                    key={color.name}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      settings.primaryColor === color.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSettings({...settings, primaryColor: color.value})}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${color.value}`}></div>
                    <span className="font-medium">{color.name}</span>
                    {settings.primaryColor === color.value && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="backgroundColor">Cor de Fundo do Sistema</Label>
              <div className="grid grid-cols-1 gap-3 mt-2 max-h-60 overflow-y-auto">
                {backgroundColors.map((bgColor) => (
                  <div
                    key={bgColor.name}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      settings.backgroundColor === bgColor.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSettings({...settings, backgroundColor: bgColor.value})}
                  >
                    <div className={`w-6 h-6 rounded-full border ${bgColor.preview}`}></div>
                    <span className="font-medium">{bgColor.name}</span>
                    {settings.backgroundColor === bgColor.value && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Escolha a cor de fundo que será aplicada em todo o sistema
              </p>
            </div>

            <Separator />

            <div>
              <Label className="text-red-600 font-semibold">Zona de Perigo</Label>
              <div className="mt-2 p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Limpar Todos os Dados</span>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Esta ação irá apagar permanentemente todas as transações, parceiros, bancos e dados de estoque. 
                  Esta operação não pode ser desfeita.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsClearDataModalOpen(true)}
                  className="w-full"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Limpar Todos os Dados do Sistema
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsSettingsModalOpen(false)} className={`bg-gradient-to-r ${settings.primaryColor}`}>
              Salvar Configurações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Data Confirmation Modal */}
      <Dialog open={isClearDataModalOpen} onOpenChange={setIsClearDataModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirmar Limpeza de Dados</span>
            </DialogTitle>
            <DialogDescription>
              Esta ação é irreversível e apagará permanentemente todos os dados do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Os seguintes dados serão apagados:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Todas as transações ({transactions.length} registros)</li>
                <li>• Todos os parceiros (exceto os padrão)</li>
                <li>• Todas as contas bancárias (exceto as padrão)</li>
                <li>• Todo o histórico de estoque</li>
                <li>• Dados de café financiado</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Dados que serão mantidos:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Configurações do sistema (cores, moeda, nome da empresa)</li>
                <li>• Parceiros e bancos padrão do sistema</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsClearDataModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={clearAllData}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Confirmar Limpeza
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}