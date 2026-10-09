export type FounderDetail = { label: string; value: string };

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  area: string;
  photo: string;
  bio: string;
  longBio: string[];
};

export const team: TeamMember[] = [
  {
    slug: "matheus-ludwichak",
    name: "Matheus Ludwichak",
    role: "CEO & Founder",
    area: "Negócios",
    photo: "/team/matheus.jpg",
    bio: "Lidera a visão comercial. Antes da V3X, somou mais de R$ 10 milhões em vendas de sistemas solares em dois anos — experiência individual.",
    longBio: [
      "Matheus lidera a visão comercial e o desenvolvimento de negócios da V3X. Possui experiência em vendas, prospecção, negociação e relacionamento comercial.",
      "Ao longo de dois anos, alcançou mais de R$ 10 milhões em vendas de sistemas solares — uma experiência individual anterior à V3X, não faturamento da empresa.",
      "Também tem interesse e experiência prática com programação e desenvolvimento de interfaces, o que conecta as necessidades comerciais dos clientes à visão de construção de produtos digitais.",
    ],
  },
  {
    slug: "isabella-christina",
    name: "Isabella Christina",
    role: "CTO & Co-founder",
    area: "Tecnologia",
    photo: "/team/isabella.jpg",
    bio: "Formação em tecnologia no Canadá e experiência como desenvolvedora sênior, incluindo a Prevent Senior.",
    longBio: [
      "Isabella possui formação na área de tecnologia no Canadá e experiência como desenvolvedora sênior, incluindo atuação na Prevent Senior.",
      "Sua experiência contribui diretamente para o desenvolvimento de sistemas, arquitetura de soluções e construção dos produtos digitais da V3X.",
    ],
  },
  {
    slug: "emmanuelle-assante",
    name: "Emmanuelle Assanté",
    role: "CFO & Co-founder",
    area: "Finanças",
    photo: "/team/emmanuelle.jpg",
    bio: "Experiência em gestão financeira e atuação em uma holding financeira. Estrutura e acompanha os recursos do negócio.",
    longBio: [
      "Emmanuelle possui experiência em gestão financeira e atuação em uma holding financeira.",
      "Sua contribuição está relacionada à organização financeira e à estruturação do negócio — estrutura e acompanha os recursos da V3X.",
    ],
  },
];
