<template>
  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Clientes</h1>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 grid grid-cols-2 gap-4">
      <div>
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Adicionar novo Cliente</CardTitle>
            <CardDescription>Informe os dados</CardDescription>
          </CardHeader>
          <form @submit.prevent="addCategory">
            <CardContent>
              <div class="grid items-center w-full gap-4">
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Nome</Label>
                  <Input id="name" placeholder="Nome do Cliente" v-model="name" />
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
              <TableHead>Ações</TableHead> <!-- Added action column -->
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in clients" :key="row.id_cliente">
              <TableCell class="font-medium">{{ row.id_cliente }}</TableCell>
              <TableCell>{{ row.nome }}</TableCell>
              <TableCell>
                <Button variant="destructive" @click="deleteClient(row.id_cliente)" >
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
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { ref } from 'vue'
import api from '@/services/api'

const name = ref('')

const addCategory = async () => {
  try {
    await api.post('/clientes', {
      nome: name.value
    })
    name.value = '' 
    getClients();
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
} from '@/components/ui/table';

const clients = ref([]);

const getClients = async () => {
  try {
    const response = await api.get('/clientes');
    clients.value = response.data.clientes; 
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
};

const deleteClient = async (clientId: number) => {
  try {
    await api.delete(`/clientes/${clientId}`);
    getClients(); 
  } catch (error) {
    console.error('Error deleting client:', error);
  }
};

import { onMounted } from 'vue';

onMounted(() => {
  getClients();
});
</script>
