<template>
  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Produtos</h1>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 grid grid-cols-2 gap-4">
      <div>
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Adicionar novo produto</CardTitle>
            <CardDescription>Informe os dados</CardDescription>
          </CardHeader>
          <form @submit.prevent="addProduct">
            <CardContent>
              <div class="grid items-center w-full gap-4">
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Nome</Label>
                  <Input id="name" placeholder="Nome do produto" v-model="name" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Valor Produto</Label>
                  <Input id="name" placeholder="Valor do produto" v-model="amount" />
                </div>
                <div class="flex flex-col space-y-1.5">
                    <Label for="category">Categoria Produto</Label>
                    <Select v-model="idcategory">
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem v-for="cat in categories" :key="cat.id_categoria" :value="cat.id_categoria">{{ cat.nome }}</SelectItem>
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
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ações</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in products" :key="row.id_produto">
              <TableCell class="font-medium">{{ row.id_produto }}</TableCell>
              <TableCell>{{ row.nome }}</TableCell>
              <TableCell>{{ row.preco }}</TableCell>
              <TableCell>{{ row.categoria.nome }}</TableCell>
              <TableCell>
                <Button variant="destructive" @click="deleteProduct(row.id_produto)" >
                  <TrashIcon class="h-5 w-5 inline-block mr-1" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </main>
</template>


<script setup lang='ts'>

import { TrashIcon } from '@heroicons/vue/24/solid'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'

import { ref, watch } from 'vue';
import api from '../../services/api'

const name = ref('')
const idcategory = ref('')
const amount = ref('')

const idestablishment = sessionStorage.getItem('selectedEstabelecimentoId');



const addProduct = async () => {
  try {
    await api.post('/produtos', {
      nome: name.value,
      id_categoria: idcategory.value,
      preco: amount.value.replace(",", "."),
      id_estabelecimento: idestablishment
    })
    name.value = '' 
    amount.value = ''
    idcategory.value = ''

    getProducts(idestablishment);
  } catch (error) {
    console.error('Error adding category:', error)
  }
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

const products = ref([]);
const categories = ref([]);


const getProducts = async (idestablishment: number | null | string) => {
  try {
    const response = await api.get(`/produtos/estabelecimento/${idestablishment}`);
    products.value = response.data.produtos; 
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const deleteProduct = async (produtctId: number) => {
  try {
    await api.delete(`/produtos/${produtctId}`);
    getProducts(idestablishment); 
  } catch (error) {
    console.error('Error deleting produtos:', error);
  }
};

const loadCategories = async () => {
  try {
    const response = await api.get('/produto/categorias')
    return response.data.categorias
  } catch (error) {
    console.error('Error loading categories:', error)
    return [] 
  }
}


watch(idestablishment, () => {
  getProducts(idestablishment);
});

import { onMounted } from 'vue';

onMounted(async () => {
  getProducts(idestablishment);
  categories.value = await loadCategories()
});
</script>
