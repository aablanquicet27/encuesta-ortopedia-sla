import { Language } from './translations';

export interface Question {
  id: string;
  text: {
    es: string;
    pt: string;
    en: string;
  };
}

export interface Domain {
  id: string;
  title: {
    es: string;
    pt: string;
    en: string;
  };
  questions: Question[];
}

export const surveyDomains: Domain[] = [
  {
    id: 'd1',
    title: {
      es: 'Dominio 1 – Evaluación clínica e imágenes',
      pt: 'Domínio 1 – Avaliação clínica e imagens',
      en: 'Domain 1 – Clinical evaluation and imaging',
    },
    questions: [
      { 
        id: 'q3', 
        text: {
          es: 'La resonancia magnética es suficiente para la evaluación inicial de la mayoría de los pacientes con inestabilidad traumática de hombro.',
          pt: 'A ressonância magnética é suficiente para a avaliação inicial da maioria dos pacientes com instabilidade traumática do ombro.',
          en: 'MRI is sufficient for the initial evaluation of most patients with traumatic shoulder instability.',
        }
      },
      { 
        id: 'q4', 
        text: {
          es: 'La tomografía computada es el método de elección para cuantificar la pérdida ósea glenoidea.',
          pt: 'A tomografia computadorizada é o método de escolha para quantificar a perda óssea glenoidal.',
          en: 'CT scan is the method of choice for quantifying glenoid bone loss.',
        }
      },
      { 
        id: 'q5', 
        text: {
          es: 'La evaluación de la glena HECHA CON TAC 3D aporta información clínicamente relevante para la planificación quirúrgica.',
          pt: 'A avaliação da glenoide FEITA COM TC 3D fornece informações clinicamente relevantes para o planejamento cirúrgico.',
          en: 'Glenoid evaluation PERFORMED WITH 3D CT provides clinically relevant information for surgical planning.',
        }
      },
      { 
        id: 'q6', 
        text: {
          es: 'La cuantificación sistemática de la pérdida ósea glenoidea debería realizarse en todos los casos de inestabilidad recurrente.',
          pt: 'A quantificação sistemática da perda óssea glenoidal deve ser realizada em todos os casos de instabilidade recorrente.',
          en: 'Systematic quantification of glenoid bone loss should be performed in all cases of recurrent instability.',
        }
      },
      { 
        id: 'q7', 
        text: {
          es: 'La caracterización morfológica de la lesión de Hill-Sachs influye directamente en la elección del procedimiento quirúrgico.',
          pt: 'A caracterização morfológica da lesão de Hill-Sachs influencia diretamente na escolha do procedimento cirúrgico.',
          en: 'Morphological characterization of the Hill-Sachs lesion directly influences the choice of surgical procedure.',
        }
      },
    ]
  },
  {
    id: 'd2',
    title: {
      es: 'Dominio 2 – Biomecánica y riesgo',
      pt: 'Domínio 2 – Biomecânica e risco',
      en: 'Domain 2 – Biomechanics and risk',
    },
    questions: [
      { 
        id: 'q8', 
        text: {
          es: 'El concepto on-track / off-track es reproducible y aplicable en la práctica clínica diaria.',
          pt: 'O conceito on-track / off-track é reproduzível e aplicável na prática clínica diária.',
          en: 'The on-track / off-track concept is reproducible and applicable in daily clinical practice.',
        }
      },
      { 
        id: 'q9', 
        text: {
          es: 'La combinación de defectos óseos glenoideos y humerales es el principal factor de fracaso del Bankart aislado.',
          pt: 'A combinação de defeitos ósseos glenoidais e umerais é o principal fator de falha do Bankart isolado.',
          en: 'The combination of glenoid and humeral bone defects is the main factor for isolated Bankart failure.',
        }
      },
      { 
        id: 'q10', 
        text: {
          es: 'La edad del paciente es un predictor más relevante de recurrencia que el número de episodios de luxación.',
          pt: 'A idade do paciente é um preditor mais relevante de recorrência do que o número de episódios de luxação.',
          en: 'Patient age is a more relevant predictor of recurrence than the number of dislocation episodes.',
        }
      },
      { 
        id: 'q11', 
        text: {
          es: 'El nivel de demanda deportiva debe considerarse un factor decisivo en la indicación quirúrgica primaria.',
          pt: 'O nível de demanda esportiva deve ser considerado um fator decisivo na indicação cirúrgica primária.',
          en: 'The level of sports demand should be considered a decisive factor in primary surgical indication.',
        }
      },
      { 
        id: 'q12', 
        text: {
          es: 'Los scores de riesgo (ej. ISI Score) son útiles para guiar la toma de decisiones terapéuticas.',
          pt: 'Os escores de risco (ex. ISI Score) são úteis para orientar a tomada de decisões terapêuticas.',
          en: 'Risk scores (e.g., ISI Score) are useful for guiding therapeutic decision-making.',
        }
      },
    ]
  },
  {
    id: 'd3',
    title: {
      es: 'Dominio 3 – Tratamiento artroscópico',
      pt: 'Domínio 3 – Tratamento artroscópico',
      en: 'Domain 3 – Arthroscopic treatment',
    },
    questions: [
      { 
        id: 'q13', 
        text: {
          es: 'La reparación artroscópica tipo Bankart sigue siendo una opción válida en pacientes sin pérdida ósea significativa.',
          pt: 'A reparação artroscópica tipo Bankart continua sendo uma opção válida em pacientes sem perda óssea significativa.',
          en: 'Arthroscopic Bankart repair remains a valid option in patients without significant bone loss.',
        }
      },
      { 
        id: 'q14', 
        text: {
          es: 'LA PLICATURA CAPSULAR o técnicas complementarias pueden mejorar la estabilidad en pacientes de alto riesgo.',
          pt: 'A PLICATURA CAPSULAR ou técnicas complementares podem melhorar a estabilidade em pacientes de alto risco.',
          en: 'CAPSULAR PLICATION or complementary techniques can improve stability in high-risk patients.',
        }
      },
      { 
        id: 'q15', 
        text: {
          es: 'La reparación capsulolabral aislada es insuficiente en la mayoría de los pacientes deportistas jóvenes.',
          pt: 'A reparação capsulolabral isolada é insuficiente na maioria dos pacientes atletas jovens.',
          en: 'Isolated capsuloabral repair is insufficient in most young athlete patients.',
        }
      },
      { 
        id: 'q16', 
        text: {
          es: 'La calidad tisular capsulolabral influye significativamente en los resultados del Bankart artroscópico.',
          pt: 'A qualidade tecidual capsulolabral influencia significativamente nos resultados do Bankart artroscópico.',
          en: 'Capsuloabral tissue quality significantly influences arthroscopic Bankart results.',
        }
      },
      { 
        id: 'q17', 
        text: {
          es: 'La experiencia del cirujano impacta directamente en los resultados del tratamiento artroscópico.',
          pt: 'A experiência do cirurgião impacta diretamente nos resultados do tratamento artroscópico.',
          en: 'Surgeon experience directly impacts arthroscopic treatment outcomes.',
        }
      },
    ]
  },
  {
    id: 'd4',
    title: {
      es: 'Dominio 4 – Procedimientos óseos',
      pt: 'Domínio 4 – Procedimentos ósseos',
      en: 'Domain 4 – Bone procedures',
    },
    questions: [
      { 
        id: 'q18', 
        text: {
          es: 'Una pérdida ósea glenoidea ≥15–20% justifica la indicación de un procedimiento óseo primario.',
          pt: 'Uma perda óssea glenoidal ≥15–20% justifica a indicação de um procedimento ósseo primário.',
          en: 'Glenoid bone loss ≥15–20% justifies the indication for a primary bone procedure.',
        }
      },
      { 
        id: 'q19', 
        text: {
          es: 'El procedimiento de Latarjet ofrece resultados confiables en pacientes con inestabilidad traumática de más de dos episodios.',
          pt: 'O procedimento de Latarjet oferece resultados confiáveis em pacientes com instabilidade traumática de mais de dois episódios.',
          en: 'The Latarjet procedure offers reliable results in patients with traumatic instability of more than two episodes.',
        }
      },
      { 
        id: 'q20', 
        text: {
          es: 'Los procedimientos óseos presentan menor tasa de recurrencia que el Bankart en deportistas de colisión sin defectos óseos.',
          pt: 'Os procedimentos ósseos apresentam menor taxa de recorrência que o Bankart em atletas de colisão sem defeitos ósseos.',
          en: 'Bone procedures have lower recurrence rates than Bankart in collision athletes without bone defects.',
        }
      },
      { 
        id: 'q21', 
        text: {
          es: 'La correcta posición y fijación del injerto óseo es determinante para el éxito del procedimiento.',
          pt: 'A posição e fixação corretas do enxerto ósseo são determinantes para o sucesso do procedimento.',
          en: 'Correct position and fixation of the bone graft is crucial for the success of the procedure.',
        }
      },
      { 
        id: 'q22', 
        text: {
          es: 'Las complicaciones asociadas al Latarjet están probablemente subestimadas en la literatura.',
          pt: 'As complicações associadas ao Latarjet estão provavelmente subestimadas na literatura.',
          en: 'Complications associated with Latarjet are probably underestimated in the literature.',
        }
      },
    ]
  },
  {
    id: 'd5',
    title: {
      es: 'Dominio 5 – Escenarios especiales',
      pt: 'Domínio 5 – Cenários especiais',
      en: 'Domain 5 – Special scenarios',
    },
    questions: [
      { 
        id: 'q23', 
        text: {
          es: 'El tratamiento conservador tiene un rol limitado en pacientes jóvenes con primer episodio traumático.',
          pt: 'O tratamento conservador tem um papel limitado em pacientes jovens com primeiro episódio traumático.',
          en: 'Conservative treatment has a limited role in young patients with first traumatic episode.',
        }
      },
      { 
        id: 'q24', 
        text: {
          es: 'La rehabilitación estructurada puede ser una opción inicial válida en pacientes seleccionados de bajo riesgo.',
          pt: 'A reabilitação estruturada pode ser uma opção inicial válida em pacientes selecionados de baixo risco.',
          en: 'Structured rehabilitation may be a valid initial option in selected low-risk patients.',
        }
      },
      { 
        id: 'q25', 
        text: {
          es: 'El manejo de la inestabilidad en pacientes mayores de 40 años debe diferenciarse del paciente joven deportista.',
          pt: 'O manejo da instabilidade em pacientes maiores de 40 anos deve ser diferenciado do paciente jovem atleta.',
          en: 'Management of instability in patients over 40 years should be differentiated from young athlete patients.',
        }
      },
      { 
        id: 'q26', 
        text: {
          es: 'La presencia de lesiones asociadas modifica significativamente la estrategia terapéutica.',
          pt: 'A presença de lesões associadas modifica significativamente a estratégia terapêutica.',
          en: 'The presence of associated injuries significantly modifies the therapeutic strategy.',
        }
      },
      { 
        id: 'q27', 
        text: {
          es: 'La decisión terapéutica debe individualizarse más allá de los algoritmos clásicos.',
          pt: 'A decisão terapêutica deve ser individualizada além dos algoritmos clássicos.',
          en: 'Therapeutic decision should be individualized beyond classical algorithms.',
        }
      },
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

export const getQuestionText = (question: Question, lang: Language): string => {
  return question.text[lang];
};

export const getDomainTitle = (domain: Domain, lang: Language): string => {
  return domain.title[lang];
};
