<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header
      class="bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-3"
    >
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="text-2xl">✨</span>
          Lorcana Scanner
        </h1>
        <button
          v-if="scannedCard"
          @click="resetScan"
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
      <!-- Scanner View -->
      <div
        v-if="!scannedCard"
        class="flex-1 flex flex-col items-center justify-center gap-6"
      >
        <!-- Camera Preview -->
        <div
          class="relative w-full max-w-sm aspect-[2.5/3.5] rounded-2xl overflow-hidden bg-black/40 border-2 border-dashed border-white/30"
        >
          <video
            ref="videoRef"
            class="absolute inset-0 w-full h-full object-cover"
            autoplay
            playsinline
          ></video>

          <!-- Scan Overlay -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="w-[90%] h-[90%] border-2 border-lorcana-amber rounded-xl relative"
            >
              <div
                class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-lorcana-amber rounded-tl-lg"
              ></div>
              <div
                class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-lorcana-amber rounded-tr-lg"
              ></div>
              <div
                class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-lorcana-amber rounded-bl-lg"
              ></div>
              <div
                class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-lorcana-amber rounded-br-lg"
              ></div>
            </div>
          </div>

          <!-- Scanning animation -->
          <div
            v-if="isScanning"
            class="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <div class="flex flex-col items-center gap-3">
              <div
                class="w-12 h-12 border-4 border-lorcana-amber border-t-transparent rounded-full animate-spin"
              ></div>
              <span class="text-white font-medium">Analyse en cours...</span>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <p class="text-white/70 text-center text-sm px-4">
          Placez une carte Lorcana dans le cadre et appuyez sur le bouton pour
          scanner
        </p>

        <!-- Search Input -->
        <div class="w-full max-w-sm">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ou recherchez par nom..."
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

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button
            @click="captureAndScan"
            :disabled="isScanning"
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-lorcana-amber to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-lorcana-amber/30 hover:shadow-lorcana-amber/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Scanner
          </button>

          <button
            @click="searchCard"
            :disabled="!searchQuery || isScanning"
            class="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Rechercher
          </button>
        </div>

        <!-- Search Results -->
        <div
          v-if="searchResults.length > 0"
          class="w-full max-w-sm max-h-60 overflow-y-auto bg-black/30 rounded-xl border border-white/10"
        >
          <button
            v-for="card in searchResults"
            :key="card.id"
            @click="selectCard(card)"
            class="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
          >
            <div class="font-medium">{{ card.name }}</div>
            <div class="text-sm text-white/60">
              {{ card.set }} - {{ card.rarity }}
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
              :src="scannedCard.image"
              :alt="scannedCard.name"
              class="w-64 rounded-xl shadow-2xl shadow-black/50"
            />
            <div
              class="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              :class="getInkColor(scannedCard.ink)"
            >
              {{ scannedCard.cost }}
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
                {{ scannedCard.name }}
              </h2>
              <p class="text-white/60 text-sm">{{ scannedCard.subtitle }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="getRarityClass(scannedCard.rarity)"
            >
              {{ scannedCard.rarity }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">Type</p>
              <p class="text-white font-medium">{{ scannedCard.type }}</p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">Encre</p>
              <p class="text-white font-medium capitalize">
                {{ scannedCard.ink }}
              </p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">Force</p>
              <p class="text-white font-medium">
                {{ scannedCard.strength || "-" }}
              </p>
            </div>
            <div class="bg-white/5 rounded-lg p-3">
              <p class="text-white/50 text-xs uppercase tracking-wide">
                Volonté
              </p>
              <p class="text-white font-medium">
                {{ scannedCard.willpower || "-" }}
              </p>
            </div>
          </div>

          <!-- Abilities -->
          <div v-if="scannedCard.abilities?.length" class="mb-4">
            <p class="text-white/50 text-xs uppercase tracking-wide mb-2">
              Capacités
            </p>
            <div
              v-for="(ability, index) in scannedCard.abilities"
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
            v-if="scannedCard.flavorText"
            class="border-t border-white/10 pt-3"
          >
            <p class="text-white/50 italic text-sm">
              "{{ scannedCard.flavorText }}"
            </p>
          </div>

          <!-- Set Info -->
          <div
            class="flex items-center justify-between mt-4 pt-3 border-t border-white/10"
          >
            <span class="text-white/50 text-sm">{{ scannedCard.set }}</span>
            <span class="text-white/50 text-sm"
              >{{ scannedCard.number }}/{{ scannedCard.totalInSet }}</span
            >
          </div>
        </div>

        <!-- Action Button -->
        <button
          @click="resetScan"
          class="w-full py-4 bg-gradient-to-r from-lorcana-amethyst to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-lorcana-amethyst/30 transition-all"
        >
          Scanner une autre carte
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
  import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
  import { Capacitor } from "@capacitor/core"

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
  }

  const config = useRuntimeConfig()
  const videoRef = ref<HTMLVideoElement | null>(null)
  const searchQuery = ref("")
  const searchResults = ref<LorcanaCard[]>([])
  const scannedCard = ref<LorcanaCard | null>(null)
  const isScanning = ref(false)
  const error = ref("")
  let mediaStream: MediaStream | null = null

  // Initialize camera on mount
  onMounted(async () => {
    await initCamera()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopCamera()
  })

  async function initCamera() {
    if (!Capacitor.isNativePlatform()) {
      // Web browser - use getUserMedia
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.value) {
          videoRef.value.srcObject = mediaStream
        }
      } catch (err) {
        console.error("Camera access denied:", err)
        error.value =
          "Impossible d'accéder à la caméra. Veuillez autoriser l'accès."
      }
    }
  }

  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop())
      mediaStream = null
    }
  }

  async function captureAndScan() {
    isScanning.value = true
    error.value = ""

    try {
      let imageBase64: string | undefined

      if (Capacitor.isNativePlatform()) {
        // Native platform - use Capacitor Camera
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
        })
        imageBase64 = photo.base64String
      } else {
        // Web browser - capture from video
        if (videoRef.value) {
          const canvas = document.createElement("canvas")
          canvas.width = videoRef.value.videoWidth
          canvas.height = videoRef.value.videoHeight
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(videoRef.value, 0, 0)
          imageBase64 = canvas.toDataURL("image/jpeg").split(",")[1]
        }
      }

      if (imageBase64) {
        // For demo purposes, we'll search using a random popular card name
        // In a real app, you would use OCR to extract the card name from the image
        await simulateScanSearch()
      }
    } catch (err: any) {
      console.error("Scan error:", err)
      error.value = err.message || "Erreur lors du scan. Veuillez réessayer."
    } finally {
      isScanning.value = false
    }
  }

  async function simulateScanSearch() {
    // Simulate scanning by searching for a popular card
    const popularCards = [
      "Mickey",
      "Elsa",
      "Stitch",
      "Maui",
      "Ursula",
      "Maleficent",
      "Simba",
      "Ariel",
    ]
    const randomCard = popularCards[
      Math.floor(Math.random() * popularCards.length)
    ] as string

    const results = await searchCardByName(randomCard)
    if (results.length > 0 && results[0]) {
      scannedCard.value = results[0]
    } else {
      error.value = "Aucune carte trouvée. Essayez de scanner à nouveau."
    }
  }

  async function searchCard() {
    if (!searchQuery.value.trim()) return

    isScanning.value = true
    error.value = ""

    try {
      const results = await searchCardByName(searchQuery.value)
      searchResults.value = results

      if (results.length === 0) {
        error.value = "Aucune carte trouvée pour cette recherche."
      }
    } catch (err: any) {
      console.error("Search error:", err)
      error.value = err.message || "Erreur lors de la recherche."
    } finally {
      isScanning.value = false
    }
  }

  async function searchCardByName(query: string): Promise<LorcanaCard[]> {
    try {
      const response = await fetch(
        `${config.public.apiBaseUrl}/cards/search?q=${encodeURIComponent(
          query
        )}`
      )

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche")
      }

      const data = await response.json()

      // Map API response to our card format
      return (data.cards || data || []).map((card: any) => ({
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
      }))
    } catch (err) {
      console.error("API Error:", err)
      throw err
    }
  }

  function selectCard(card: LorcanaCard) {
    scannedCard.value = card
    searchResults.value = []
    searchQuery.value = ""
  }

  function resetScan() {
    scannedCard.value = null
    searchResults.value = []
    searchQuery.value = ""
    initCamera()
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
</style>
