export const userRoutes = [
  {
    name: 'Medical_Package_Layout',
    component: 'Layout',
    order: 0,
    parentId: 0,
    path: '/',
    redirect: '/medical_package',
    title: '体检套餐',
    icon: 'box',
    meta: {
      icon: 'box',
      title: '体检套餐',
    },
    children: [
      {
        name: 'Medical_Package',
        component: 'systemManage/medicalPackageManage/index',
        order: 0,
        parentId: 0,
        path: '/medical_package',
        title: '体检套餐',
        icon: 'box',
        meta: {
          icon: 'box',
          title: '体检套餐',
        },
      },
    ],
  },
  {
    name: 'Medical_Project_Layout',
    component: 'Layout',
    order: 0,
    parentId: 0,
    path: '/',
    redirect: '/medical_project',
    title: '体检项目',
    icon: 'box-open',
    meta: {
      icon: 'box-open',
      title: '体检项目',
    },
    children: [
      {
        name: 'Medical_Project',
        component: 'systemManage/medicalProjectManage/index',
        order: 0,
        parentId: 0,
        path: '/medical_project',
        title: '体检项目',
        icon: 'box-open',
        meta: {
          icon: 'box-open',
          title: '体检项目',
        },
      },
    ],
  },
  {
    name: 'Business',
    component: 'Layout',
    order: 0,
    parentId: 0,
    path: '/business',
    redirect: 'noDirect',
    title: '体检业务',
    icon: 'bars',
    meta: {
      icon: 'bars',
      title: '体检业务',
    },
    children: [
      {
        name: 'Bill',
        component: 'checkupManage/billManage/index',
        order: 0,
        parentId: 0,
        path: '/bill',
        title: '体检办理',
        icon: 'envelope-open-text',
        meta: {
          icon: 'envelope-open-text',
          title: '体检办理',
        },
      },
    ],
  },
]
