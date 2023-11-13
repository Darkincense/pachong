const fangji = [
  {
    name: '胰腺癌肝转移',
    inspection_report: '', // 检查报告
    diagnostic_result: '', // 中医诊断结果
    treatment_method: '', // 治疗方法
    children: [
      {
        consultation_date: '2007-04-02', // 看诊日期
        diagnosis: 1, // 看诊第次数
        symptom: '面色萎黄,灰暗,体瘦,精神尚可,舌淡紫无苔,齿痕,畏寒甚,食生冷瓜果,立觉冷彻心脾,腰困如折,二便调,食纳不香,脉微',  // 症状
        diagnostic_result: '劳倦内伤,痰湿中阻,肾气大虚', // 中医诊断结果
        treatment_method: '固本消积', // 治疗方法
        practice: '3000ml水，文火煮取400ml', // 煎煮方法
        how_to_take: '日分三次服用，连服2月', // 服用方法
        remark: '制附片逐日累加10g，无上限，至出现瞑眩反应时降低10g',
        prescription: [
          {
            name: '高丽参',
            weight: '15',
            unit: 'g',
            remark: '另煎',
          },
          {
            name: '漂海藻',
            weight: '30',
            unit: 'g',
            remark: '',
          },
          {
            name: '炙甘草',
            weight: '30',
            unit: 'g',
            remark: '',
          },
          {
            name: '清全蝎',
            weight: '12',
            unit: '只',
            remark: '研沫冲服',
          },
          {
            name: '大蜈蚣',
            weight: '3',
            unit: '条',
            remark: '研沫冲服',
          },
          {
            name: '白芥子',
            weight: '10',
            unit: 'g',
            remark: '炒研',
          },
          {
            name: '大熟地',
            weight: '30',
            unit: 'g',
            remark: '',
          },
          {
            name: '五灵脂',
            weight: '30',
            unit: 'g',
            remark: '',
          },
          {
            name: '麻黄',
            weight: '5',
            unit: 'g',
            remark: '',
          },
          {
            name: '紫油桂',
            weight: '10',
            unit: 'g',
            remark: '后5分下',
          },
          {
            name: '鹿角霜',
            weight: '45',
            unit: 'g',
            remark: '',
          },
          {
            name: '姜炭',
            weight: '15',
            unit: 'g',
            remark: '',
          },
          {
            name: '生半夏',
            weight: '75',
            unit: 'g',
            remark: '',
          },
          {
            name: '生南星',
            weight: '10',
            unit: 'g',
            remark: '',
          },
          {
            name: '制附片',
            weight: '45',
            unit: 'g',
            remark: '',
          },
          {
            name: '茯苓',
            weight: '45',
            unit: 'g',
            remark: '',
          },
          {
            name: '辽细辛',
            weight: '45',
            unit: 'g',
            remark: '后5分下',
          },
          {
            name: '大贝',
            weight: '120',
            unit: 'g',
            remark: '',
          },
          {
            name: '生姜',
            weight: '45',
            unit: 'g',
            remark: '',
          },
        ], // 药方
      },
      {
        consultation_date: '2007-05-04', // 看诊日期
        diagnosis: 2, // 看诊第次数
        symptom: '主症悉退,面色灰暗退去大半,',  // 症状
        diagnostic_result: '劳倦内伤,痰湿中阻,肾气大虚', // 中医诊断结果
        treatment_method: '固本消积', // 治疗方法
        practice: '3000ml水，文火煮取400ml', // 煎煮方法
        how_to_take: '日分三次服用，连服2月', // 服用方法
        remark: '制附片增加至395g,守方续用,另加股本散,以固先天肾气;固本散用法用法3g/次,日3次',
        prescription: [
          {
            name: '二十头三七',
            weight: '200',
            unit: 'g',
            remark: '',
          },
          {
            name: '高丽参',
            weight: '100',
            unit: 'g',
            remark: '',
          },
          {
            name: '血琥珀',
            weight: '100',
            unit: 'g',
            remark: '',
          },
          {
            name: '二杠',
            weight: '100',
            unit: 'g',
            remark: '',
          },
          {
            name: '血河车',
            weight: '100',
            unit: 'g',
            remark: '',
          },
          {
            name: '高丽参',
            weight: '100',
            unit: 'g',
            remark: '',
          },
          {
            name: '灵芝',
            weight: '100',
            unit: 'g',
            remark: '',
          },
          {
            name: '孢子粉',
            weight: '100',
            unit: 'g',
            remark: '',
          },
          {
            name: '止痉散',
            weight: '50~60',
            unit: 'g',
            remark: '',
          },
        ]
      }
    ],
  },
  {
    name: '肝癌晚期',
    inspection_report: '左肝三个肿块，右肝一个肿块，最大7.5cm', // 检查报告
    diagnostic_result: '高年阳衰，寒湿凝聚三阴', // 中医诊断结果
    treatment_method: '', // 治疗方法
    children: [
      {
        consultation_date: '2006-06-11', // 看诊日期
        diagnosis: 1, // 看诊第次数
        symptom: '无法行动,舌胖,淡紫,齿痕,中裂,苔白腻,舌边瘀斑成片,脉微细而数疾,120次/分,纳差,二便调,体重61.5kg',  // 症状
        diagnostic_result: '高年阳衰，寒湿凝聚三阴', // 中医诊断结果
        treatment_method: '', // 治疗方法
        practice: '3000ml水，文火煮取500ml', // 煎煮方法
        how_to_take: '日分三次服用，10剂', // 服用方法
        remark: '',
        prescription: [
          {
            name: '漂海藻',
            weight: '30',
            unit: 'g',
            remark: '',
          },
          {
            name: '甘草',
            weight: '30',
            unit: 'g',
            remark: '',
          },
          {
            name: '清全蝎',
            weight: '12',
            unit: '只',
            remark: '',
          },
          {
            name: '大蜈蚣',
            weight: '12',
            unit: '条',
            remark: '',
          },
          {
            name: '制附片',
            weight: '45',
            unit: 'g',
            remark: '',
          },
          {
            name: '紫油桂',
            weight: '10',
            unit: 'g',
            remark: '后下',
          },
          {
            name: '白芥子',
            weight: '10',
            unit: 'g',
            remark: '炒研',
          },
          {
            name: '麻黄',
            weight: '5',
            unit: 'g',
            remark: '',
          },
          {
            name: '大熟地',
            weight: '90',
            unit: 'g',
            remark: '',
          },
          {
            name: '鹿角霜',
            weight: '45',
            unit: 'g',
            remark: '',
          },
          {
            name: '姜炭',
            weight: '5',
            unit: 'g',
            remark: '',
          },
          {
            name: '鸡矢藤',
            weight: '60',
            unit: 'g',
            remark: '',
          },
          {
            name: '高丽参',
            weight: '15',
            unit: 'g',
            remark: '研冲',
          },
          {
            name: '五灵脂',
            weight: '15',
            unit: 'g',
            remark: '',
          },
        ]
      }
    ]
  }
]
