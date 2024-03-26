<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="text-white text-lg font-semibold" @click="closeDropdown()">Home</router-link>
      <div class="space-x-12">        
        <div class="relative inline-block text-left" @click="toggleDropdown('estabelecimento')" ref="dropdownEstabelecimentos">
          <button class="text-white">Estabelecimentos <svg class="h-5 w-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div v-show="activeDropdown === 'estabelecimento'" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <router-link to="/establishment" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">Estabelecimentos</router-link>
            <router-link to="/establishment/category" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">Categorias</router-link>
          </div>
        </div>
        <router-link to="/clientes" class="text-white" @click="closeDropdown()">Clientes</router-link>
        <router-link to="/pedidos" class="text-white" @click="closeDropdown()">Pedidos</router-link>
        <div class="relative inline-block text-left" @click="toggleDropdown('produtos')" ref="dropdownProdutos">
          <button class="text-white">Produtos <svg class="h-5 w-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
          <div v-show="activeDropdown === 'produtos'" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <router-link to="/products" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">Produtos</router-link>
            <router-link to="/products/category" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">Categorias</router-link>
          </div>
        </div>


        <router-link to="/report" class="text-white" @click="closeDropdown()">Relatório</router-link>


        <div class="relative inline-block  text-gray-200">
          <span>Estabelecimento</span>
          <Select v-model="selectedEstabelecimento">
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione o Estabelecimento" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem v-for="row in establishments" :key="row.id_estabelecimento" :value="row.id_estabelecimento" @click="saveSelectedEstabelecimento(row.id_estabelecimento, row.nome)">{{ row.nome }}</SelectItem>
            </SelectContent>
          </Select>
        </div>


      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/services/api'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

</script>


<script lang="ts">
import { defineComponent, ref } from 'vue';

const establishments = ref([]);
const selectedEstabelecimentoId = ref('');
const selectedEstabelecimentoNome = ref('');
const router = useRouter();

const loadEstablishment = async () => {
  try {
    const response = await api.get('/estabelecimentos')
    return response.data.estabelecimentos
  } catch (error) {
    console.error('Error loading Establishment:', error)
    return [] 
  }
}

const saveSelectedEstabelecimento = (id, nome) => {
  selectedEstabelecimentoId.value = id;
  selectedEstabelecimentoNome.value = nome;
  sessionStorage.setItem('selectedEstabelecimentoId', id);
  sessionStorage.setItem('selectedEstabelecimentoNome', nome);
}

const setSelectedEstabelecimentoFromSession = () => {
  const id = sessionStorage.getItem('selectedEstabelecimentoId');
  const nome = sessionStorage.getItem('selectedEstabelecimentoNome');
  if (id && nome) {
    selectedEstabelecimentoId.value = id;
    selectedEstabelecimentoNome.value = nome;
  }
}


export default defineComponent({
  name: 'Navbar',
  data() {
    return {
      activeDropdown: null as string | null,
      selectedEstabelecimento: '', 
    };
  },
  methods: {
    toggleDropdown(dropdown: string) {
      if (this.activeDropdown === dropdown) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = dropdown;
      }
    },
    closeDropdown() {
      this.activeDropdown = null;
    },
    closeDropdownOnClickOutside(event: MouseEvent) {
      const dropdownEstabelecimentos = this.$refs.dropdownEstabelecimentos as HTMLElement;
      const dropdownProdutos = this.$refs.dropdownProdutos as HTMLElement;

      if (
        dropdownEstabelecimentos &&
        !dropdownEstabelecimentos.contains(event.target as Node) &&
        dropdownProdutos &&
        !dropdownProdutos.contains(event.target as Node)
      ) {
        this.closeDropdown();
      }
    },
  },
  async mounted() {
    document.addEventListener('click', this.closeDropdownOnClickOutside);
    establishments.value = await loadEstablishment();
    setSelectedEstabelecimentoFromSession();
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  },
  watch: {
    selectedEstabelecimento(newValue) {
      // Salvar o estabelecimento selecionado na sessão
      sessionStorage.setItem('selectedEstabelecimento', newValue);
      
    }
  }
});
</script>
