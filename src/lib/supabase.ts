import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface HarvestRecord {
  id: string
  date: string
  variety: 'arabica' | 'robusta'
  quantity: number
  location?: string
  responsible?: string
  notes?: string
  status: 'processando' | 'concluido'
  created_at?: string
  updated_at?: string
}

export interface CoffeeStock {
  id: string
  total_quantity: number
  comercial_quantity: number
  coco_quantity: number
  financed_quantity: number
  financed_comercial: number
  financed_coco: number
  arabica_quantity: number
  robusta_quantity: number
  last_updated: string
  created_at?: string
}

// Funções auxiliares para interação com o banco
export const harvestService = {
  // Buscar todos os registros de colheita
  async getAll() {
    const { data, error } = await supabase
      .from('harvest_records')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Criar novo registro de colheita
  async create(harvest: Omit<HarvestRecord, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('harvest_records')
      .insert([harvest])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar registro de colheita
  async update(id: string, harvest: Partial<HarvestRecord>) {
    const { data, error } = await supabase
      .from('harvest_records')
      .update(harvest)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar registro de colheita
  async delete(id: string) {
    const { error } = await supabase
      .from('harvest_records')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

export const stockService = {
  // Buscar estoque atual
  async getCurrent() {
    const { data, error } = await supabase
      .from('coffee_stock')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar estoque
  async update(stock: Partial<CoffeeStock>) {
    const { data, error } = await supabase
      .from('coffee_stock')
      .update({
        ...stock,
        last_updated: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}