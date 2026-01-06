<template>
  <div class="min-h-screen flex flex-col safe-area-container">
    <!-- Header -->
    <header
      class="bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-3 pt-safe"
    >
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="text-2xl">✨</span>
          Lorcana Search
        </h1>
        <button
          v-if="selectedCard"
          @click="resetSearch"
          class="text-white/70 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col p-4">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex-1 flex flex-col items-center justify-center gap-4"
      >
        <div
          class="w-16 h-16 border-4 border-lorcana-amber border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="text-white/70 text-sm">Chargement des cartes...</p>
      </div>

      <!-- Search View -->
      <div
        v-else-if="!selectedCard"
        class="flex-1 flex flex-col items-center justify-center gap-6"
      >
        <!-- Logo / Icon -->
        <div class="flex flex-col items-center gap-3">
          <div
            class="w-24 h-24 rounded-full bg-gradient-to-br from-lorcana-amber to-orange-500 flex items-center justify-center shadow-lg shadow-lorcana-amber/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p class="text-white/70 text-center text-sm px-4">
            Recherchez une carte par son nom ou son ID
          </p>
        </div>

        <!-- Search Input -->
        <div class="w-full max-w-sm">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nom de la carte ou ID..."
              class="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-lorcana-amber focus:ring-1 focus:ring-lorcana-amber transition-all"
              @keyup.enter="searchCard"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Search Button -->
        <button
          @click="searchCard"
          :disabled="!searchQuery || isSearching"
          class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-lorcana-amber to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-lorcana-amber/30 hover:shadow-lorcana-amber/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="isSearching"
            class="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {{ isSearching ? "Recherche..." : "Rechercher" }}
        </button>

        <!-- Search Results -->
        <div
          v-if="searchResults.length > 0"
          class="w-full max-w-sm max-h-80 overflow-y-auto bg-black/30 rounded-xl border border-white/10"
        >
          <button
            v-for="card in searchResults"
            :key="card.id"
            @click="selectCard(card)"
            class="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 flex items-center gap-3"
          >
            <img
              :src="card.image"
              :alt="card.name"
              class="w-12 h-16 object-cover rounded-md flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ card.name }}</div>
              <div class="text-sm text-white/60 truncate">
                {{ card.set }} - {{ card.rarity }} - {{ card.fullIdentifier }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Card Details View -->
      <div v-else class="flex-1 flex flex-col gap-4 animate-fade-in">
        <!-- Card Image -->
        <div class="flex justify-center">
          <div class="relative">
            <img
              :src="selectedCard.image"
              :alt="selectedCard.name"
              class="w-64 rounded-xl shadow-2xl shadow-black/50"
            />
            <div
              class="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              :class="getInkColor(selectedCard.ink)"
            >
              {{ selectedCard.cost }}
            </div>
          </div>
        </div>

        <!-- Card Info -->
        <div
          class="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <h2 class="text-xl font-bold text-white">
                {{ selectedCard.name }}
              </h2>
              <p class="text-white/60 text-sm">{{ selectedCard.subtitle }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="getRarityClass(selectedCard.rarity)"
            >
              {{ selectedCard.rarity }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">Type</p>
              <p class="text-white font-medium">{{ selectedCard.type }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">Encre</p>
              <p class="text-white font-medium capitalize">
                {{ selectedCard.ink }}
              </p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">Force</p>
              <p class="text-white font-medium">
                {{ selectedCard.strength || "-" }}
              </p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">
                Volonté
              </p>
              <p class="text-white font-medium">
                {{ selectedCard.willpower || "-" }}
              </p>
            </div>
          </div>

          <!-- Abilities -->
          <div v-if="selectedCard.abilities?.length" class="mb-4">
            <p class="text-white/50 text-xs uppercase tracking-wide mb-2">
              Capacités
            </p>
            <div
              v-for="(ability, index) in selectedCard.abilities"
              :key="index"
              class="bg-white/5 rounded-lg p-3 mb-2"
            >
              <p class="text-lorcana-amber font-semibold text-sm">
                {{ ability.name }}
              </p>
              <p class="text-white/80 text-sm">{{ ability.effect }}</p>
            </div>
          </div>

          <!-- Flavor Text -->
          <div
            v-if="selectedCard.flavorText"
            class="border-t border-white/10 pt-3"
          >
            <p class="text-white/50 italic text-sm">
              "{{ selectedCard.flavorText }}"
            </p>
          </div>

          <!-- Set Info -->
          <div
            class="flex items-center justify-between mt-4 pt-3 border-t border-white/10"
          >
            <span class="text-white/50 text-sm">{{ selectedCard.set }}</span>
            <span class="text-white/50 text-sm"
              >{{ selectedCard.number }}/{{ selectedCard.totalInSet }}</span
            >
          </div>
        </div>

        <!-- Action Button -->
        <button
          @click="resetSearch"
          class="w-full py-4 bg-gradient-to-r from-lorcana-amethyst to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-lorcana-amethyst/30 transition-all"
        >
          Rechercher une autre carte
        </button>
      </div>
    </main>

    <!-- Error Toast -->
    <Transition name="slide-up">
      <div
        v-if="error"
        class="fixed bottom-4 left-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl flex items-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="flex-1 text-sm">{{ error }}</span>
        <button @click="error = ''" class="text-white/80 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { Capacitor, CapacitorHttp } from "@capacitor/core"

  interface CardAbility {
    name: string
    effect: string
  }

  interface LorcanaCard {
    id: string
    name: string
    subtitle?: string
    type: string
    ink: string
    cost: number
    strength?: number
    willpower?: number
    rarity: string
    set: string
    number: string
    totalInSet: string
    image: string
    abilities?: CardAbility[]
    flavorText?: string
    fullIdentifier?: string
  }

  const searchQuery = ref("")
  const searchResults = ref<LorcanaCard[]>([])
  const selectedCard = ref<LorcanaCard | null>(null)
  const isSearching = ref(false)
  const isLoading = ref(true)
  const error = ref("")
  const isNative = ref(false)
  const allCards = ref<LorcanaCard[]>([])

  onMounted(async () => {
    isNative.value = Capacitor.isNativePlatform()
    await loadAllCards()
  })

  async function loadAllCards() {
    isLoading.value = true
    error.value = ""

    try {
      let data: any

      if (isNative.value) {
        // Use native HTTP on mobile (no CORS issues)
        const apiUrl = `https://lorca-lab.com/api/cards/search`
        try {
          const response = await CapacitorHttp.get({
            url: apiUrl,
            headers: {
              "Content-Type": "application/json",
            },
          })
          data = response.data
        } catch (networkError) {
          throw new Error(
            "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
          )
        }
      } else {
        // Use fetch with proxy on web
        const proxyUrl = `/api/cards/search`
        let response: Response
        try {
          response = await fetch(proxyUrl)
        } catch (networkError) {
          throw new Error(
            "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
          )
        }

        if (!response.ok) {
          if (response.status >= 500) {
            throw new Error(
              "Le serveur est temporairement indisponible. Réessayez plus tard."
            )
          } else {
            throw new Error(`Erreur serveur (${response.status}). Réessayez.`)
          }
        }

        try {
          data = await response.json()
        } catch (parseError) {
          throw new Error("Erreur lors de la lecture des données.")
        }
      }

      // Map API response to our card format
      allCards.value = (data.cards || data || []).map((card: any) => ({
        id: card.id || card._id,
        name: card.name || card.title,
        subtitle: card.subtitle || card.version,
        type: card.type || "Personnage",
        ink: card.ink || card.color || "amber",
        cost: card.cost || card.inkCost || 0,
        strength: card.strength || card.attack,
        willpower: card.willpower || card.defense,
        rarity: card.rarity || "Commune",
        set: card.set || card.setName || "The First Chapter",
        number: card.number || card.cardNumber || "001",
        totalInSet: card.totalInSet || "204",
        image:
          card.image ||
          card.imageUrl ||
          card.images?.full ||
          `https://lorca-lab.com/cards/${card.id}.jpg`,
        abilities: card.abilities || [],
        flavorText: card.flavorText || card.flavor,
        fullIdentifier: card.fullIdentifier || `${card.set}-${card.number}`,
      }))
    } catch (err: any) {
      console.error("Load error:", err)
      error.value = err.message || "Erreur lors du chargement des cartes."
    } finally {
      isLoading.value = false
    }
  }

  async function searchCard() {
    if (!searchQuery.value.trim()) return

    isSearching.value = true
    error.value = ""

    try {
      const results = searchCardByName(searchQuery.value)
      searchResults.value = results

      if (results.length === 0) {
        error.value = "Aucune carte trouvée pour cette recherche."
      }
    } catch (err: any) {
      console.error("Search error:", err)
      error.value = err.message || "Erreur lors de la recherche."
    } finally {
      isSearching.value = false
    }
  }

  function searchCardByName(query: string): LorcanaCard[] {
    const queryLower = query.toLowerCase().trim()

    return allCards.value.filter((card) => {
      const name = (card.name || "").toLowerCase()
      const subtitle = (card.subtitle || "").toLowerCase()
      const id = (card.id || "").toString().toLowerCase()
      const fullIdentifier = (card.fullIdentifier || "").toLowerCase()

      return (
        name.includes(queryLower) ||
        subtitle.includes(queryLower) ||
        id.includes(queryLower) ||
        fullIdentifier.includes(queryLower)
      )
    })
  }

  function selectCard(card: LorcanaCard) {
    selectedCard.value = card
    searchResults.value = []
    searchQuery.value = ""
  }

  function resetSearch() {
    selectedCard.value = null
    searchResults.value = []
    searchQuery.value = ""
  }

  function getInkColor(ink: string): string {
    const colors: Record<string, string> = {
      amber: "bg-lorcana-amber",
      amethyst: "bg-lorcana-amethyst",
      emerald: "bg-lorcana-emerald",
      ruby: "bg-lorcana-ruby",
      sapphire: "bg-lorcana-sapphire",
      steel: "bg-lorcana-steel",
    }
    return colors[ink.toLowerCase()] || "bg-gray-500"
  }

  function getRarityClass(rarity: string): string {
    const classes: Record<string, string> = {
      Commune: "bg-gray-500/50 text-gray-200",
      Common: "bg-gray-500/50 text-gray-200",
      Inhabituelle: "bg-green-500/50 text-green-200",
      Uncommon: "bg-green-500/50 text-green-200",
      Rare: "bg-blue-500/50 text-blue-200",
      "Super Rare": "bg-purple-500/50 text-purple-200",
      Légendaire: "bg-yellow-500/50 text-yellow-200",
      Legendary: "bg-yellow-500/50 text-yellow-200",
      Enchanted:
        "bg-gradient-to-r from-pink-500/50 to-purple-500/50 text-pink-200",
    }
    return classes[rarity] || "bg-gray-500/50 text-gray-200"
  }
</script>

<style>
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.3s ease;
  }

  .slide-up-enter-from,
  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }

  /* Safe area support for mobile devices */
  .safe-area-container {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }

  .pt-safe {
    padding-top: max(0.75rem, env(safe-area-inset-top));
  }

  .pb-safe {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
</style>
