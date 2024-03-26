import Vue from 'vue';
import Router from 'vue-router';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Establishment from '../views/establishments/Establishment.vue';
import EstablishmentCategory from '../views/establishments/category/Category.vue';
import Clientes from '../views/Clientes.vue';
import Report from '../views/Report.vue';
import Products from '../views/products/Products.vue';
import ProductsCategory from '../views/products/category/Category.vue';
import Pedidos from '../views/Pedidos.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/establishment',
    name: 'Estabelecimentos',
    component: Establishment
  },
  {
    path: '/establishment/category',
    name: 'Categoria Estabelecimentos',
    component: EstablishmentCategory
  },
  
  {
    path: '/clientes',
    name: 'Clientes',
    component: Clientes
  },
  {
    path: '/report',
    name: 'Relatório',
    component: Report
  },
  {
    path: '/products',
    name: 'Produtos',
    component: Products
  },
  {
    path: '/products/category',
    name: 'Categoria Produtos',
    component: ProductsCategory
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: Pedidos
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
