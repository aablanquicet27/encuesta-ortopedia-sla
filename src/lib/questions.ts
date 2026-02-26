export interface Question {
  id: string;
  text: string;
}

export interface Domain {
  id: string;
  title: string;
  questions: Question[];
}

export const surveyDomains: Domain[] = [
  {
    id: 'd1',
    title: 'Dominio 1 – Evaluación clínica e imágenes',
    questions: [
      { id: 'q3', text: 'La resonancia magnética es suficiente para la evaluación inicial de la mayoría de los pacientes con inestabilidad traumática de hombro.' },
      { id: 'q4', text: 'La tomografía computada es el método de elección para cuantificar la pérdida ósea glenoidea.' },
      { id: 'q5', text: 'La evaluación tridimensional de la glena aporta información clínicamente relevante para la planificación quirúrgica.' },
      { id: 'q6', text: 'La cuantificación sistemática de la pérdida ósea glenoidea debería realizarse en todos los casos de inestabilidad recurrente.' },
      { id: 'q7', text: 'La caracterización morfológica de la lesión de Hill-Sachs influye directamente en la elección del procedimiento quirúrgico.' },
    ]
  },
  {
    id: 'd2',
    title: 'Dominio 2 – Biomecánica y riesgo',
    questions: [
      { id: 'q8', text: 'El concepto on-track / off-track es reproducible y aplicable en la práctica clínica diaria.' },
      { id: 'q9', text: 'La combinación de defectos óseos glenoideos y humerales es el principal factor de fracaso del Bankart aislado.' },
      { id: 'q10', text: 'La edad del paciente es un predictor más relevante de recurrencia que el número de episodios de luxación.' },
      { id: 'q11', text: 'El nivel de demanda deportiva debe considerarse un factor decisivo en la indicación quirúrgica primaria.' },
      { id: 'q12', text: 'Los scores de riesgo (ej. ISI Score) son útiles para guiar la toma de decisiones terapéuticas.' },
    ]
  },
  {
    id: 'd3',
    title: 'Dominio 3 – Tratamiento artroscópico',
    questions: [
      { id: 'q13', text: 'La reparación artroscópica tipo Bankart sigue siendo una opción válida en pacientes sin pérdida ósea significativa.' },
      { id: 'q14', text: 'El refuerzo capsular o técnicas complementarias pueden mejorar la estabilidad en pacientes de alto riesgo.' },
      { id: 'q15', text: 'La reparación capsulolabral aislada es insuficiente en la mayoría de los pacientes deportistas jóvenes.' },
      { id: 'q16', text: 'La calidad tisular capsulolabral influye significativamente en los resultados del Bankart artroscópico.' },
      { id: 'q17', text: 'La experiencia del cirujano impacta directamente en los resultados del tratamiento artroscópico.' },
    ]
  },
  {
    id: 'd4',
    title: 'Dominio 4 – Procedimientos óseos',
    questions: [
      { id: 'q18', text: 'Una pérdida ósea glenoidea ≥15–20% justifica la indicación de un procedimiento óseo primario.' },
      { id: 'q19', text: 'El procedimiento de Latarjet ofrece resultados confiables en pacientes jóvenes con inestabilidad traumática recurrente.' },
      { id: 'q20', text: 'Los procedimientos óseos presentan menor tasa de recurrencia que el Bankart en pacientes de alto riesgo.' },
      { id: 'q21', text: 'La correcta posición y fijación del injerto óseo es determinante para el éxito del procedimiento.' },
      { id: 'q22', text: 'Las complicaciones asociadas al Latarjet están probablemente subestimadas en la literatura.' },
    ]
  },
  {
    id: 'd5',
    title: 'Dominio 5 – Escenarios especiales',
    questions: [
      { id: 'q23', text: 'El tratamiento conservador tiene un rol limitado en pacientes jóvenes con primer episodio traumático.' },
      { id: 'q24', text: 'La rehabilitación estructurada puede ser una opción inicial válida en pacientes seleccionados de bajo riesgo.' },
      { id: 'q25', text: 'El manejo de la inestabilidad en pacientes mayores de 40 años debe diferenciarse del paciente joven deportista.' },
      { id: 'q26', text: 'La presencia de lesiones asociadas modifica significativamente la estrategia terapéutica.' },
      { id: 'q27', text: 'La decisión terapéutica debe individualizarse más allá de los algoritmos clásicos.' },
    ]
  }
];

export const likertScale = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
];
