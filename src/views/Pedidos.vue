<template>
<header class="bg-white shadow">
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900">Pedidos</h1>
  
    <div class="flex flex-col ">
      <Label for="category"> Selecione o cliente</Label>
      <Select v-model="idClient">
        <SelectTrigger id="clients">
          <SelectValue placeholder="..." />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem v-for="row in clients" :key="row.id_cliente" :value="row.id_cliente">{{ row.nome }}</SelectItem>
        </SelectContent>
      </Select>
      
      <span>Saldo: {{ amount }}</span>
    </div>
  </div>
</header>


  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-12 grid grid-cols-1 gap-4">
      <div>
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Criar novo pedido</CardTitle>
            <CardDescription>Escolha seu produto</CardDescription>
          </CardHeader>
          <loading-overlay :active="loading" :can-cancel="false" :full-page="false" :color="'#4CAF50'"></loading-overlay>
          <form @submit.prevent="addInvoice">
            <CardContent>
              <div class="grid items-center w-full gap-4">
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Quantidade</Label>
                  <Input id="name" type="number" placeholder="Informe a quantidade" v-model="quantity" />
                </div>
                <div class="flex flex-col space-y-1.5">
                    <Label for="produto">Produto</Label>
                    <Select v-model="idProdutoPedido">
                      <SelectTrigger id="produto">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem v-for="cat in products" :key="cat.id_produto" :value="cat.id_produto">{{ cat.nome }}</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter class="flex justify-between px-6 pb-6">
              <Button type="submit">Adicionar</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
  
    </div>
  </main>
</template>

<script setup lang='ts'>
import { TrashIcon } from '@heroicons/vue/24/solid'
import { Input } from '@/components/ui/input'
import LoadingOverlay from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ref } from 'vue'
import { onMounted, watch } from 'vue';
import api from '@/services/api';

const idestablishment = sessionStorage.getItem('selectedEstabelecimentoId');

// Define reactive variables
const idProdutoPedido = ref('');
const loading = ref(false)
const amount = ref(0);
const quantity = ref(1);
const idClient = ref(''); // Initialize idClient with null

// Fetch categories and clients
const products = ref([]);
const clients = ref([]);
const invoices = ref([]);

const getProducts = async (idestablishment: number | null | string) => {
  try {
    const response = await api.get(`/produtos/estabelecimento/${idestablishment}`);
    products.value = response.data.produtos; 
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const getClient = async () => {
  try {
    const response = await api.get('/clientes');
    clients.value = response.data.clientes;
  } catch (error) {
    console.error('Error loading clients:', error);
  }
};

// Function to delete a category
const deleteInvoices = async (categoryId: number) => {
  try {
    await api.delete(`/pedidos/${categoryId}`);
    console.log('Invoice deleted successfully!');
    getProducts(idestablishment); // Update category list
  } catch (error) {
    console.error('Error deleting invoice:', error);
  }
};

// Function to add a category
const addInvoice = async () => {
  try {
    loading.value = true
    await api.post('/pedidos', {
      id_produto: idProdutoPedido.value,
      id_cliente : idClient.value,
      id_estabelecimento: idestablishment,
      quantity: quantity.value,
    });

    idProdutoPedido.value = '';
    quantity.value = 1;
    console.log('Invoice added successfully!');
    getProducts(idestablishment);
    getClient();
    loading.value = false
  } catch (error) {
    console.error('Error adding Invoice:', error);
    loading.value = false
  }
};

// Fetch categories and clients on component mount
onMounted(async () => {
  getProducts(idestablishment);
  getClient();
});

watch(idClient, (newValue, oldValue) => {
  if (newValue !== null) {
    const selectedClient = clients.value.find(client => client.id_cliente === newValue);
    if (selectedClient) {
      amount.value = selectedClient.saldo_bonus;
    } else {
      amount.value = 0;
    }
  }
});
</script>
