<template>
  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Estabelecimentos</h1>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 grid grid-cols-2 gap-4">
      <div>
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Adicionar nova categoria</CardTitle>
            <CardDescription>Informe os dados</CardDescription>
          </CardHeader>
          <loading-overlay :active="loading" :can-cancel="false" :full-page="false" :color="'#4CAF50'"></loading-overlay>
            <form @submit.prevent="addEstablishment">
                  <!-- Validation errors display -->
            
                <Alert v-if="formErrors.length" variant="destructive">
                  <ExclamationTriangleIcon class="w-4 h-4" />
                  <AlertTitle>Atenção!</AlertTitle>
                  <AlertDescription v-for="error in formErrors" :key="error">{{ error }}</AlertDescription>
                </Alert>
            
              <CardContent>
                <div class="grid items-center w-full gap-4">
                  <div class="flex flex-col space-y-1.5">
                    <Label for="name">Nome</Label>
                    <Input id="name" placeholder="Nome da categoria" v-model="name" />
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <Label for="name">Descrição</Label>
                    <Input id="name" placeholder="Nome da categoria" v-model="description" />
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <Label for="cep">CEP</Label>
                    <Input id="cep" placeholder="CEP do estabelecimento" v-model="cep" @blur="fetchAddressFromCEP" />
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <Label for="address">Endereço</Label>
                    <Input id="address" placeholder="Endereço do estabelecimento" v-model="address" />
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <Label for="category">Categoria de Estabelecimento</Label>
                    <Select v-model="idcategory">
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem v-for="cat in categories" :key="cat.categoria_id" :value="cat.categoria_id">{{ cat.nome }}</SelectItem>
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
              <TableHead>Categoria</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Ações</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in establishment" :key="row.id_estabelecimento">
              <TableCell class="font-medium">{{ row.id_estabelecimento }}</TableCell>
              <TableCell>{{ row.categoria.nome }}</TableCell>
              <TableCell>{{ row.nome }}</TableCell>
              <TableCell>{{ row.endereco }}</TableCell>
              <TableCell>
                <Button variant="destructive" @click="deleteEstablishment(row.id_estabelecimento)" >
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
import { ExclamationTriangleIcon } from '@radix-icons/vue'
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

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';


import { ref, onMounted } from 'vue'

import api from '../../services/api'

const name = ref('')
const cep = ref('')
const address = ref('')
const description = ref('')
const idcategory = ref('')
const loading = ref(false)
const formErrors = ref([]);
const establishment = ref([]);
const categories = ref([])


const addEstablishment = async () => {
  // Resetting previous errors
  formErrors.value = [];

  // Your existing form submission logic
  if (!name.value.trim()) {
    formErrors.value.push('Nome é obrigatório.');
  }

  if (!description.value.trim()) {
    formErrors.value.push('Descrição é obrigatória.');
  }

  if (!idcategory.value) {
    formErrors.value.push('Categoria é obrigatória.');
  }

  if (!cep.value.trim()) {
    formErrors.value.push('CEP é obrigatório.');
  }

  if (!address.value.trim()) {
    formErrors.value.push('Endereço é obrigatório.');
  }

  // Checking if there are any errors
  if (formErrors.value.length === 0) {
    // If no errors, proceed with form submission
    loading.value = true;
    try {
      await api.post('/estabelecimentos', {
        nome: name.value,
        descricao: description.value,
        categoria_id: idcategory.value,
        endereco: address.value,
      });
      // Resetting form fields
      name.value = '';
      idcategory.value = '';
      address.value = '';
      cep.value = '';
      description.value = '';
      // Fetching establishments
      getEstablishment();
      loading.value = false;
    } catch (error) {
      console.error('Error adding Establishment:', error);
      loading.value = false;
    }
  }
};

const fetchAddressFromCEP = async () => {
  try {
    loading.value = true
    const response = await api.get(`https://viacep.com.br/ws/${cep.value}/json/`)
    if (!response.data.erro) {
      address.value = `${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade}, ${response.data.uf}`
    } else {
      console.error('CEP not found')
    }
    loading.value = false
  } catch (error) {
    console.error('Error fetching address from CEP:', error)
    loading.value = false
  }
}

const getEstablishment = async () => {
  try {
    const response = await api.get('/estabelecimentos');
    establishment.value = response.data.estabelecimentos; 
  } catch (error) {
    console.error('Error fetching Establishment:', error);
  }
};

const deleteEstablishment = async (establishmentId: number) => {
  try {
    await api.delete(`/estabelecimentos/${establishmentId}`);
    console.log('Establishment deleted successfully!');
    getEstablishment();
  } catch (error) {
    console.error('Error deleting Establishment:', error);
  }
};


const loadCategories = async () => {
  try {
    const response = await api.get('/categorias')
    return response.data.categorias
  } catch (error) {
    console.error('Error loading categories:', error)
    return [] 
  }
}

onMounted(async () => {
  getEstablishment();
  categories.value = await loadCategories()
})

</script>
