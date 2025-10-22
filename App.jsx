import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Plus, Trash2, Upload, MessageSquare, Dumbbell, UtensilsCrossed, Activity, TrendingUp, Calendar, FileText, Brain } from 'lucide-react'
import logo from './assets/steroidplotter-logo.svg'
import './App.css'

// Dados expandidos de compostos
const COMPOUNDS_DATA = {
  steroids: {
    testosterone: {
      name: 'Testosterona',
      types: {
        cypionate: { name: 'Cipionato', halfLife: 8, bioavailability: 1.0 },
        enanthate: { name: 'Enantato', halfLife: 7, bioavailability: 1.0 },
        propionate: { name: 'Propionato', halfLife: 2, bioavailability: 1.0 },
        undecanoate: { name: 'Undecanoato', halfLife: 33.9, bioavailability: 1.0 },
        suspension: { name: 'Suspensão', halfLife: 0.5, bioavailability: 1.0 },
      }
    },
    nandrolone: {
      name: 'Nandrolona',
      types: {
        decanoate: { name: 'Decanoato (Deca)', halfLife: 6, bioavailability: 1.0 },
        phenylpropionate: { name: 'Fenilpropionato (NPP)', halfLife: 3, bioavailability: 1.0 },
      }
    },
    trenbolone: {
      name: 'Trembolona',
      types: {
        acetate: { name: 'Acetato', halfLife: 1, bioavailability: 1.0 },
        enanthate: { name: 'Enantato', halfLife: 5, bioavailability: 1.0 },
      }
    },
    boldenone: {
      name: 'Boldenona',
      types: {
        undecylenate: { name: 'Undecilato (EQ)', halfLife: 14, bioavailability: 1.0 },
      }
    },
    masteron: {
      name: 'Masteron',
      types: {
        propionate: { name: 'Propionato', halfLife: 2, bioavailability: 1.0 },
        enanthate: { name: 'Enantato', halfLife: 5, bioavailability: 1.0 },
      }
    },
    primobolan: {
      name: 'Primobolan',
      types: {
        injectable: { name: 'Injetável (Enantato)', halfLife: 10, bioavailability: 1.0 },
        oral: { name: 'Oral (Acetato)', halfLife: 0.5, bioavailability: 0.7 },
      }
    },
  },
  orals: {
    anavar: { name: 'Anavar (Oxandrolona)', types: { oral: { name: 'Oral', halfLife: 0.4, bioavailability: 0.95 } } },
    dianabol: { name: 'Dianabol (Metandrostenolona)', types: { oral: { name: 'Oral', halfLife: 0.2, bioavailability: 0.9 } } },
    winstrol: { name: 'Winstrol (Stanozolol)', types: { oral: { name: 'Oral', halfLife: 0.4, bioavailability: 0.8 } } },
    anadrol: { name: 'Anadrol (Oximetolona)', types: { oral: { name: 'Oral', halfLife: 0.3, bioavailability: 0.95 } } },
    turinabol: { name: 'Turinabol', types: { oral: { name: 'Oral', halfLife: 0.7, bioavailability: 0.85 } } },
  },
  peptides: {
    hcg: { name: 'HCG', types: { standard: { name: 'Padrão', halfLife: 1.5, bioavailability: 1.0 } } },
    hgh: { name: 'HGH (Hormônio do Crescimento)', types: { standard: { name: 'Padrão', halfLife: 0.17, bioavailability: 0.75 } } },
    bpc157: { name: 'BPC-157', types: { standard: { name: 'Padrão', halfLife: 0.25, bioavailability: 0.8 } } },
    tb500: { name: 'TB-500', types: { standard: { name: 'Padrão', halfLife: 4, bioavailability: 0.9 } } },
  },
  ancillaries: {
    arimidex: { name: 'Arimidex (Anastrozol)', types: { oral: { name: 'Oral', halfLife: 2, bioavailability: 0.85 } } },
    aromasin: { name: 'Aromasin (Exemestano)', types: { oral: { name: 'Oral', halfLife: 1, bioavailability: 0.42 } } },
    nolvadex: { name: 'Nolvadex (Tamoxifeno)', types: { oral: { name: 'Oral', halfLife: 5, bioavailability: 1.0 } } },
    clomid: { name: 'Clomid (Clomifeno)', types: { oral: { name: 'Oral', halfLife: 5, bioavailability: 1.0 } } },
    cabergoline: { name: 'Cabergolina', types: { oral: { name: 'Oral', halfLife: 2.5, bioavailability: 0.85 } } },
  }
}

const DOSING_SCHEDULES = [
  { value: '0.25', label: '4x ao dia' },
  { value: '0.333', label: '3x ao dia' },
  { value: '0.5', label: '2x ao dia' },
  { value: '1', label: 'Diário' },
  { value: '2', label: 'Dia sim, dia não' },
  { value: '3', label: 'A cada 3 dias' },
  { value: '3.5', label: 'A cada 3.5 dias' },
  { value: '7', label: 'Semanal' },
  { value: '14', label: 'Quinzenal' },
]

const PRESET_PROTOCOLS = [
  {
    name: 'TRT Básico - 150mg/semana',
    compounds: [
      { category: 'steroids', compound: 'testosterone', type: 'cypionate', dose: '75', schedule: '3.5', fromWeek: 1, toWeek: 52 }
    ]
  },
  {
    name: 'Primeiro Ciclo - Test 500mg',
    compounds: [
      { category: 'steroids', compound: 'testosterone', type: 'enanthate', dose: '250', schedule: '3.5', fromWeek: 1, toWeek: 12 }
    ]
  },
  {
    name: 'Bulking - Test + Deca',
    compounds: [
      { category: 'steroids', compound: 'testosterone', type: 'enanthate', dose: '250', schedule: '3.5', fromWeek: 1, toWeek: 16 },
      { category: 'steroids', compound: 'nandrolone', type: 'decanoate', dose: '200', schedule: '7', fromWeek: 1, toWeek: 14 }
    ]
  },
  {
    name: 'Cutting - Test + Tren + Masteron',
    compounds: [
      { category: 'steroids', compound: 'testosterone', type: 'propionate', dose: '100', schedule: '2', fromWeek: 1, toWeek: 10 },
      { category: 'steroids', compound: 'trenbolone', type: 'acetate', dose: '50', schedule: '2', fromWeek: 1, toWeek: 8 },
      { category: 'steroids', compound: 'masteron', type: 'propionate', dose: '100', schedule: '2', fromWeek: 1, toWeek: 10 }
    ]
  }
]

function App() {
  // Estados para Plotter
  const [cycleName, setCycleName] = useState('')
  const [cycleLength, setCycleLength] = useState(12)
  const [compounds, setCompounds] = useState([{
    id: 1,
    category: '',
    compound: '',
    type: '',
    dose: '',
    schedule: '7',
    offset: 0,
    fromWeek: 1,
    toWeek: 12
  }])
  const [chartData, setChartData] = useState([])
  const [showChart, setShowChart] = useState(false)

  // Estados para Chat IA
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou seu assistente de saúde e performance. Posso ajudar com interpretação de exames, planejamento de ciclos, treinos e nutrição. Como posso ajudar?' }
  ])
  const [chatInput, setChatInput] = useState('')

  // Estados para Exames
  const [examFile, setExamFile] = useState(null)
  const [examData, setExamData] = useState(null)

  // Estados para Treino
  const [trainingGoal, setTrainingGoal] = useState('hypertrophy')
  const [trainingDays, setTrainingDays] = useState('4')
  const [trainingPlan, setTrainingPlan] = useState(null)

  // Estados para Nutrição
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [nutritionGoal, setNutritionGoal] = useState('maintain')
  const [macros, setMacros] = useState(null)

  // Função para calcular níveis sanguíneos
  const calculateBloodLevels = (dose, halfLife, days, dosingInterval, offset = 0) => {
    const levels = []
    const k = Math.log(2) / halfLife
    
    for (let day = 0; day <= days; day++) {
      let level = 0
      for (let doseDay = offset; doseDay <= day; doseDay += parseFloat(dosingInterval)) {
        if (doseDay > days) break
        const timeSinceDose = day - doseDay
        if (timeSinceDose >= 0) {
          level += parseFloat(dose) * Math.exp(-k * timeSinceDose)
        }
      }
      levels.push(level)
    }
    return levels
  }

  // Plotar gráfico
  const handlePlot = () => {
    const totalDays = cycleLength * 7
    const data = []

    for (let day = 0; day <= totalDays; day++) {
      data.push({ day, week: (day / 7).toFixed(1) })
    }

    compounds.forEach((comp) => {
      if (!comp.category || !comp.compound || !comp.type || !comp.dose) return

      const compoundData = COMPOUNDS_DATA[comp.category]?.[comp.compound]
      if (!compoundData) return

      const typeData = compoundData.types[comp.type]
      if (!typeData) return

      const fromDay = (comp.fromWeek - 1) * 7
      const toDay = comp.toWeek * 7
      const levels = calculateBloodLevels(
        comp.dose,
        typeData.halfLife,
        totalDays,
        comp.schedule,
        fromDay + comp.offset
      )

      const compoundName = `${compoundData.name} ${typeData.name}`
      
      data.forEach((point, i) => {
        if (i >= fromDay && i <= toDay) {
          point[compoundName] = levels[i]?.toFixed(2) || 0
        } else {
          point[compoundName] = 0
        }
      })
    })

    setChartData(data)
    setShowChart(true)
  }

  // Carregar protocolo pré-configurado
  const loadPreset = (preset) => {
    const newCompounds = preset.compounds.map((comp, index) => ({
      ...comp,
      id: index + 1,
      offset: 0
    }))
    setCompounds(newCompounds)
    setCycleName(preset.name)
  }

  // Adicionar composto
  const addCompound = () => {
    setCompounds([...compounds, {
      id: compounds.length + 1,
      category: '',
      compound: '',
      type: '',
      dose: '',
      schedule: '7',
      offset: 0,
      fromWeek: 1,
      toWeek: cycleLength
    }])
  }

  // Remover composto
  const removeCompound = (id) => {
    setCompounds(compounds.filter(c => c.id !== id))
  }

  // Atualizar composto
  const updateCompound = (id, field, value) => {
    setCompounds(compounds.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  // Enviar mensagem no chat
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const newMessages = [...chatMessages, { role: 'user', content: chatInput }]
    setChatMessages(newMessages)
    setChatInput('')

    // Simular resposta da IA (em produção, conectaria com API OpenAI)
    setTimeout(() => {
      let response = ''
      
      if (chatInput.toLowerCase().includes('testosterona') || chatInput.toLowerCase().includes('exame')) {
        response = 'Para interpretar seus níveis de testosterona, preciso saber:\n\n1. Valor total de testosterona (ng/dL)\n2. Testosterona livre\n3. SHBG (globulina ligadora de hormônios sexuais)\n4. Estradiol\n5. LH e FSH\n\nVocê pode fazer upload do seu exame na aba "Análise de Exames" para uma análise completa!'
      } else if (chatInput.toLowerCase().includes('ciclo') || chatInput.toLowerCase().includes('trt')) {
        response = 'Para um primeiro ciclo, recomendo:\n\n• Testosterona Enantato ou Cipionato: 300-500mg/semana\n• Duração: 12-16 semanas\n• Divisão: 2x por semana (ex: segunda e quinta)\n• Ancilares: Arimidex 0.5mg 2x/semana (se necessário)\n• PCT: Nolvadex 40/40/20/20mg por 4 semanas\n\nLembre-se: sempre faça exames antes, durante e depois!'
      } else if (chatInput.toLowerCase().includes('treino') || chatInput.toLowerCase().includes('musculação')) {
        response = 'Para hipertrofia máxima, recomendo:\n\n• Frequência: 4-6x por semana\n• Volume: 10-20 séries por grupo muscular/semana\n• Intensidade: 6-12 repetições\n• Progressão de carga semanal\n\nVá na aba "Plano de Treino" para gerar um programa personalizado!'
      } else if (chatInput.toLowerCase().includes('dieta') || chatInput.toLowerCase().includes('nutrição')) {
        response = 'Para ganho de massa muscular:\n\n• Calorias: +300-500 acima da manutenção\n• Proteína: 2-2.5g por kg de peso corporal\n• Carboidratos: 4-6g por kg\n• Gorduras: 0.8-1g por kg\n\nUse a aba "Nutrição" para calcular seus macros personalizados!'
      } else {
        response = 'Entendo sua dúvida. Posso ajudar com:\n\n• Interpretação de exames hormonais\n• Planejamento de ciclos e TRT\n• Programas de treino personalizados\n• Planos alimentares\n• Dúvidas sobre compostos e protocolos\n\nSobre o que gostaria de saber mais?'
      }

      setChatMessages([...newMessages, { role: 'assistant', content: response }])
    }, 1000)
  }

  // Simular análise de exame
  const analyzeExam = () => {
    if (!examFile) return

    // Simular extração de dados (em produção usaria OCR/AI)
    setExamData({
      testosterone_total: 450,
      testosterone_free: 12.5,
      estradiol: 28,
      lh: 4.2,
      fsh: 3.8,
      shbg: 32,
      analysis: 'Seus níveis hormonais estão dentro da faixa normal, mas no limite inferior. Considere otimização através de TRT se tiver sintomas de baixa testosterona.'
    })
  }

  // Gerar plano de treino
  const generateTrainingPlan = () => {
    const plans = {
      '4_hypertrophy': {
        name: 'Hipertrofia 4x/semana',
        split: ['Peito + Tríceps', 'Costas + Bíceps', 'Pernas + Ombros', 'Upper Body'],
        exercises: [
          { day: 1, exercises: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Tríceps Pulley', 'Tríceps Testa'] },
          { day: 2, exercises: ['Barra Fixa', 'Remada Curvada', 'Pulldown', 'Rosca Direta', 'Rosca Martelo'] },
          { day: 3, exercises: ['Agachamento', 'Leg Press', 'Stiff', 'Desenvolvimento', 'Elevação Lateral'] },
          { day: 4, exercises: ['Supino Inclinado', 'Remada Cavalinho', 'Desenvolvimento', 'Rosca', 'Tríceps'] }
        ]
      },
      '5_hypertrophy': {
        name: 'Hipertrofia 5x/semana',
        split: ['Peito', 'Costas', 'Pernas', 'Ombros + Braços', 'Upper Body'],
        exercises: [
          { day: 1, exercises: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Crossover', 'Flexão'] },
          { day: 2, exercises: ['Barra Fixa', 'Remada Curvada', 'Pulldown', 'Remada Unilateral', 'Pullover'] },
          { day: 3, exercises: ['Agachamento', 'Leg Press', 'Cadeira Extensora', 'Stiff', 'Cadeira Flexora'] },
          { day: 4, exercises: ['Desenvolvimento', 'Elevação Lateral', 'Rosca Direta', 'Rosca Martelo', 'Tríceps'] },
          { day: 5, exercises: ['Supino', 'Remada', 'Desenvolvimento', 'Rosca', 'Tríceps'] }
        ]
      }
    }

    const key = `${trainingDays}_${trainingGoal}`
    setTrainingPlan(plans[key] || plans['4_hypertrophy'])
  }

  // Calcular macros
  const calculateMacros = () => {
    if (!weight || !height || !age) return

    // Fórmula de Harris-Benedict
    const bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age) + 5
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }

    const tdee = bmr * activityMultipliers[activityLevel]
    
    let calories = tdee
    if (nutritionGoal === 'bulk') calories += 500
    if (nutritionGoal === 'cut') calories -= 500

    const protein = parseFloat(weight) * 2.2
    const fat = parseFloat(weight) * 1
    const carbs = (calories - (protein * 4 + fat * 9)) / 4

    setMacros({
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo" className="h-14 w-auto" />
              <div>
                <h1 className="text-3xl font-bold">ZaniniNogueira Health & Performance</h1>
                <p className="text-blue-100 text-sm">Plataforma Completa de Saúde, Hormônios, Treino e Nutrição</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="plotter" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="plotter" className="gap-2">
              <Activity className="h-4 w-4" />
              Plotter
            </TabsTrigger>
            <TabsTrigger value="exams" className="gap-2">
              <FileText className="h-4 w-4" />
              Exames
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-2">
              <Dumbbell className="h-4 w-4" />
              Treino
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Nutrição
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="h-4 w-4" />
              Chat IA
            </TabsTrigger>
          </TabsList>

          {/* Tab: Plotter */}
          <TabsContent value="plotter" className="space-y-6">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Planejador de Ciclos e TRT
                </CardTitle>
                <CardDescription>
                  Configure seu protocolo e visualize os níveis hormonais estimados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Protocolos Pré-configurados */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Protocolos Pré-configurados</Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {PRESET_PROTOCOLS.map((preset, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        onClick={() => loadPreset(preset)}
                        className="h-auto py-3 text-left justify-start"
                      >
                        <div>
                          <div className="font-semibold text-sm">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {preset.compounds.length} composto(s)
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cycleName">Nome do Protocolo</Label>
                    <Input
                      id="cycleName"
                      placeholder="Meu Protocolo"
                      value={cycleName}
                      onChange={(e) => setCycleName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength">Duração (semanas)</Label>
                    <Select value={cycleLength.toString()} onValueChange={(v) => setCycleLength(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                          <SelectItem key={week} value={week.toString()}>
                            {week} {week === 1 ? 'semana' : 'semanas'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Compostos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Compostos</Label>
                    <Button onClick={addCompound} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>

                  {compounds.map((compound) => (
                    <Card key={compound.id} className="bg-gradient-to-br from-white to-slate-50 border-2">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select
                              value={compound.category}
                              onValueChange={(v) => updateCompound(compound.id, 'category', v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="steroids">Esteroides Injetáveis</SelectItem>
                                <SelectItem value="orals">Esteroides Orais</SelectItem>
                                <SelectItem value="peptides">Peptídeos</SelectItem>
                                <SelectItem value="ancillaries">Ancilares/PCT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {compound.category && (
                            <div className="space-y-2">
                              <Label>Composto</Label>
                              <Select
                                value={compound.compound}
                                onValueChange={(v) => updateCompound(compound.id, 'compound', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(COMPOUNDS_DATA[compound.category] || {}).map(([key, data]) => (
                                    <SelectItem key={key} value={key}>{data.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {compound.compound && (
                            <div className="space-y-2">
                              <Label>Tipo</Label>
                              <Select
                                value={compound.type}
                                onValueChange={(v) => updateCompound(compound.id, 'type', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(
                                    COMPOUNDS_DATA[compound.category]?.[compound.compound]?.types || {}
                                  ).map(([key, data]) => (
                                    <SelectItem key={key} value={key}>{data.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Dose (mg)</Label>
                            <Input
                              type="number"
                              placeholder="250"
                              value={compound.dose}
                              onChange={(e) => updateCompound(compound.id, 'dose', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Frequência</Label>
                            <Select
                              value={compound.schedule}
                              onValueChange={(v) => updateCompound(compound.id, 'schedule', v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DOSING_SCHEDULES.map(schedule => (
                                  <SelectItem key={schedule.value} value={schedule.value}>
                                    {schedule.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Da Semana</Label>
                            <Input
                              type="number"
                              min="1"
                              max={cycleLength}
                              value={compound.fromWeek}
                              onChange={(e) => updateCompound(compound.id, 'fromWeek', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Até a Semana</Label>
                            <Input
                              type="number"
                              min="1"
                              max={cycleLength}
                              value={compound.toWeek}
                              onChange={(e) => updateCompound(compound.id, 'toWeek', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Offset (dias)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={compound.offset}
                              onChange={(e) => updateCompound(compound.id, 'offset', parseInt(e.target.value))}
                            />
                          </div>
                        </div>

                        {compounds.length > 1 && (
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCompound(compound.id)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remover
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Botões */}
                <div className="flex gap-4 justify-center pt-4">
                  <Button onClick={handlePlot} size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                    Plotar Gráfico
                  </Button>
                </div>

                {/* Gráfico */}
                {showChart && chartData.length > 0 && (
                  <Card className="mt-8 border-2">
                    <CardHeader>
                      <CardTitle>Níveis Sanguíneos Estimados</CardTitle>
                      <CardDescription>
                        Concentração estimada no sangue ao longo do tempo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="week" 
                              label={{ value: 'Semanas', position: 'insideBottom', offset: -5 }}
                            />
                            <YAxis 
                              label={{ value: 'Concentração (ng/dL)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip />
                            <Legend />
                            {Object.keys(chartData[0] || {})
                              .filter(key => key !== 'day' && key !== 'week')
                              .map((key, index) => (
                                <Line
                                  key={key}
                                  type="monotone"
                                  dataKey={key}
                                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                                  strokeWidth={3}
                                  dot={false}
                                />
                              ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Análise de Exames */}
          <TabsContent value="exams" className="space-y-6">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Análise de Exames Laboratoriais
                </CardTitle>
                <CardDescription>
                  Faça upload dos seus exames para análise automática com IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <Label htmlFor="exam-upload" className="cursor-pointer">
                      <div className="text-lg font-semibold">Clique para fazer upload</div>
                      <div className="text-sm text-muted-foreground">PDF ou imagem do exame</div>
                    </Label>
                    <Input
                      id="exam-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,image/*"
                      onChange={(e) => setExamFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  {examFile && (
                    <div className="text-sm text-green-600">
                      Arquivo selecionado: {examFile.name}
                    </div>
                  )}
                  <Button onClick={analyzeExam} disabled={!examFile}>
                    Analisar Exame
                  </Button>
                </div>

                {examData && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2">
                    <CardHeader>
                      <CardTitle>Resultados do Exame</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-sm text-muted-foreground">Testosterona Total</div>
                          <div className="text-2xl font-bold">{examData.testosterone_total} ng/dL</div>
                          <div className="text-xs text-muted-foreground">Ref: 264-916</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-sm text-muted-foreground">Testosterona Livre</div>
                          <div className="text-2xl font-bold">{examData.testosterone_free} pg/mL</div>
                          <div className="text-xs text-muted-foreground">Ref: 5.0-21.0</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-sm text-muted-foreground">Estradiol</div>
                          <div className="text-2xl font-bold">{examData.estradiol} pg/mL</div>
                          <div className="text-xs text-muted-foreground">Ref: 10-40</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-sm text-muted-foreground">LH</div>
                          <div className="text-2xl font-bold">{examData.lh} mIU/mL</div>
                          <div className="text-xs text-muted-foreground">Ref: 1.7-8.6</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-sm text-muted-foreground">FSH</div>
                          <div className="text-2xl font-bold">{examData.fsh} mIU/mL</div>
                          <div className="text-xs text-muted-foreground">Ref: 1.5-12.4</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-sm text-muted-foreground">SHBG</div>
                          <div className="text-2xl font-bold">{examData.shbg} nmol/L</div>
                          <div className="text-xs text-muted-foreground">Ref: 16-55</div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg border">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          Análise da IA
                        </h3>
                        <p className="text-sm">{examData.analysis}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Plano de Treino */}
          <TabsContent value="training" className="space-y-6">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Dumbbell className="h-6 w-6" />
                  Plano de Treino Personalizado
                </CardTitle>
                <CardDescription>
                  Configure seus objetivos e gere um programa de treino otimizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Objetivo</Label>
                    <Select value={trainingGoal} onValueChange={setTrainingGoal}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hypertrophy">Hipertrofia</SelectItem>
                        <SelectItem value="strength">Força</SelectItem>
                        <SelectItem value="endurance">Resistência</SelectItem>
                        <SelectItem value="cutting">Definição</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Dias por Semana</Label>
                    <Select value={trainingDays} onValueChange={setTrainingDays}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="4">4 dias</SelectItem>
                        <SelectItem value="5">5 dias</SelectItem>
                        <SelectItem value="6">6 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={generateTrainingPlan} className="w-full">
                  Gerar Plano de Treino
                </Button>

                {trainingPlan && (
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2">
                    <CardHeader>
                      <CardTitle>{trainingPlan.name}</CardTitle>
                      <CardDescription>Divisão: {trainingPlan.split.join(' • ')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {trainingPlan.exercises.map((day, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Dia {day.day}: {trainingPlan.split[idx]}
                          </h3>
                          <ul className="space-y-1">
                            {day.exercises.map((exercise, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                                  {i + 1}
                                </span>
                                {exercise}
                                <span className="text-xs text-muted-foreground ml-auto">3-4 séries × 8-12 reps</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Nutrição */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <UtensilsCrossed className="h-6 w-6" />
                  Plano Nutricional Personalizado
                </CardTitle>
                <CardDescription>
                  Calcule suas necessidades calóricas e distribuição de macronutrientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Peso (kg)</Label>
                    <Input
                      type="number"
                      placeholder="80"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Altura (cm)</Label>
                    <Input
                      type="number"
                      placeholder="180"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Idade</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nível de Atividade</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentário</SelectItem>
                        <SelectItem value="light">Leve (1-3x/semana)</SelectItem>
                        <SelectItem value="moderate">Moderado (3-5x/semana)</SelectItem>
                        <SelectItem value="active">Ativo (6-7x/semana)</SelectItem>
                        <SelectItem value="very_active">Muito Ativo (2x/dia)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Objetivo</Label>
                    <Select value={nutritionGoal} onValueChange={setNutritionGoal}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cut">Perder Gordura (Cutting)</SelectItem>
                        <SelectItem value="maintain">Manutenção</SelectItem>
                        <SelectItem value="bulk">Ganhar Massa (Bulking)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateMacros} className="w-full">
                  Calcular Macros
                </Button>

                {macros && (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2">
                    <CardHeader>
                      <CardTitle>Suas Necessidades Diárias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg border text-center">
                          <div className="text-sm text-muted-foreground mb-1">Calorias</div>
                          <div className="text-3xl font-bold text-blue-600">{macros.calories}</div>
                          <div className="text-xs text-muted-foreground">kcal/dia</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border text-center">
                          <div className="text-sm text-muted-foreground mb-1">Proteína</div>
                          <div className="text-3xl font-bold text-red-600">{macros.protein}g</div>
                          <div className="text-xs text-muted-foreground">{(macros.protein * 4 / macros.calories * 100).toFixed(0)}% calorias</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border text-center">
                          <div className="text-sm text-muted-foreground mb-1">Carboidratos</div>
                          <div className="text-3xl font-bold text-orange-600">{macros.carbs}g</div>
                          <div className="text-xs text-muted-foreground">{(macros.carbs * 4 / macros.calories * 100).toFixed(0)}% calorias</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg border text-center">
                          <div className="text-sm text-muted-foreground mb-1">Gorduras</div>
                          <div className="text-3xl font-bold text-yellow-600">{macros.fat}g</div>
                          <div className="text-xs text-muted-foreground">{(macros.fat * 9 / macros.calories * 100).toFixed(0)}% calorias</div>
                        </div>
                      </div>

                      <div className="mt-6 bg-white p-6 rounded-lg border">
                        <h3 className="font-semibold mb-3">Exemplo de Distribuição de Refeições</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Café da Manhã (25%)</span>
                            <span className="font-semibold">{Math.round(macros.calories * 0.25)} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Almoço (35%)</span>
                            <span className="font-semibold">{Math.round(macros.calories * 0.35)} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lanche Pré-Treino (10%)</span>
                            <span className="font-semibold">{Math.round(macros.calories * 0.10)} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Jantar (30%)</span>
                            <span className="font-semibold">{Math.round(macros.calories * 0.30)} kcal</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Chat IA */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Assistente de IA - Saúde & Performance
                </CardTitle>
                <CardDescription>
                  Converse com nossa IA sobre exames, ciclos, treinos e nutrição
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gradient-to-br from-slate-50 to-gray-50">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border-2 border-blue-200'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Digite sua pergunta sobre exames, ciclos, treinos ou nutrição..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendChatMessage()
                      }
                    }}
                    rows={3}
                  />
                  <Button onClick={sendChatMessage} className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Enviar
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-sm">Exemplos de perguntas:</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• "Minha testosterona está em 350 ng/dL, isso é normal?"</li>
                    <li>• "Qual o melhor protocolo de TRT para iniciantes?"</li>
                    <li>• "Como montar uma dieta para ganhar massa muscular?"</li>
                    <li>• "Qual a diferença entre Test E e Test C?"</li>
                    <li>• "Preciso de PCT após um ciclo de 12 semanas?"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              © 2025 ZaniniNogueira Health & Performance. Plataforma educacional completa.
            </p>
            <p className="text-xs text-slate-500">
              ⚠️ Este site é apenas para fins educacionais e informativos. Não constitui aconselhamento médico.
              Sempre consulte um profissional de saúde qualificado antes de iniciar qualquer protocolo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

