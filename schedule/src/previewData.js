const data = {
    groups: [
        {
          id: 1,
          name: "4 курс",
          subgroups: [
            {
              id: 2,
              name: "2-й поток",
              subgroups: [
                {
                  id: 3,
                  name: "КБ",
                  subgroups: [],
                },
                {
                  id: 4,
                  name: "ПИ",
                  subgroups: [
                    {
                      id: 5,
                      name: "1+5 ПИ",
                      subgroups: [ 
                        {
                        id: 6,
                        name: "5 ПИ",
                        subgroups: [
                            {
                                id: 7,
                                name: "подгруппа 1",
                                subgroups: []
                            }
                        ]
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
    ],
    // teachers: [
    //     {
    //         "id": 1,
    //         "name": "Хейдоров И. Э.",
    //         "schedule": [
    //             [
    //                 1,
    //                 4
    //             ],
    //             [
    //                 1,
    //                 4
    //             ],
    //             [
    //                 1,
    //                 2,
    //                 3
    //             ],
    //             [
    //                 1,
    //                 4
    //             ],
    //             [
    //                 1,
    //                 4
    //             ],
    //             [
    //                 1,
    //                 4
    //             ],
    //             [
    //                 1,
    //                 4
    //             ],
    //             [
    //                 1,
    //                 4
    //             ],
    //         ]
    //     }
    // ]
}

export default data