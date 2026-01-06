import { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.lorcanascan.app",
  appName: "lorcana-scan",
  webDir: ".output/public",
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
