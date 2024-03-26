<template>
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Relatório</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 grid grid-cols-2 gap-4">
        <div>
          <Card class="w-[800px]">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <form @submit.prevent="searchInvoices">
              <CardContent>
                <div class="grid items-center w-full ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead class="w-[100px]">ID Pedido</TableHead>
                        <TableHead>Nome Cliente</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Valor Total</TableHead>

                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="row in invoices" :key="row.id_pedido">
                        <TableCell class="font-medium">{{ row.id_pedido }}</TableCell>
                        <TableCell>{{ row.cliente.nome }}</TableCell>
                        <TableCell>{{ row.produtos.nome }}</TableCell>
                        <TableCell>{{ row.valor_total }}</TableCell>
        

                      </TableRow>
                    </TableBody>  
                  </Table>
                </div>
              </CardContent>
             
            </form>
          </Card>
        </div>
        <div>
          
        </div>
      </div>
    </main>
  </template>
  
  <script setup lang='ts'>
  import {
    Card,
    CardContent,
    
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'

  import { ref } from 'vue'
  import api from '@/services/api'
  
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  
  const invoices = ref([]);
  

  const idestablishment = sessionStorage.getItem('selectedEstabelecimentoId');
  
  const searchInvoices = async () => {
    try {
      const response = await api.get(`/pedidos/search/${idestablishment}`);
      invoices.value = response.data.invoices; 
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  }
  
  

  
  import { onMounted } from 'vue';
  
  onMounted(() => {
    searchInvoices();
  });
  </script>
  