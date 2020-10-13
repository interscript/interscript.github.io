<template>
  <fragment>
    <h2>Romanization examples</h2>
    <p>
      <i
        >Each title of a language or a writing system is followed by a note on
        the appropriate romanization system used (UN = United Nations, BGN/PCGN
        = US Board on Geographic Names and Permanent Committee on Geographical
        Names for British Official Use)</i
      >
    </p>
    <div style="display: flex">
      <div style="flex: 1">
        <div v-for="(s,i) in sampleLeft" :key="i">
          <p>
            <strong style="color: #002060">{{s.lang}}</strong> [{{s.isoName}}]
          </p>
          <p>
            <span v-for="(e,i) in s.samples" :key="i">
              {{ `${e} ${s.result[i] ? s.result[i] : ''} ` }}
            </span>
            <i>{{ s.systemName ? '' : ' (To be implemented)' }}</i>
          </p>
        </div>
      </div>
      <div style="flex: 1">
        <div v-for="(s,i) in sampleRight" :key="i">
          <p>
            <strong style="color: #002060">{{s.lang}}</strong> [{{s.isoName}}]
          </p>
          <p>
            <span v-for="(e,i) in s.samples" :key="i">
              {{ `${e} ${s.result[i] ? s.result[i] : ''} ` }}
            </span>
            <i>{{ s.systemName ? '' : ' (To be implemented)' }}</i>
          </p>
        </div>
      </div>
    </div>
  </fragment>
</template>
<script>
import samples from "./samples.json"
import axios from "axios"

export default {
  name: "Sample",
  data() {
    return {
      sampleData: []
    }
  },
  mounted() {
    (async () => {
      const Opal = window.Opal
      const data = await Promise.all(samples.map(async(s) => {
        const text = s.samples.join(',')
        const { systemName: system } = s
        if (!text || !system) return s
        try {
          const { data: json } = await axios.get(`/maps/${system}.json`)
          Opal.Interscript.$load_map_json(system, JSON.stringify(json))
          const result = Opal.Interscript.$transliterate(system, text).split(',')
          return {...s, result }
        } catch (e) {
          console.log(e)
        }
        return s
      }))
      this.sampleData = data
    })()
  },
  computed: {
    sampleLeft: function () { return this.sampleData.slice(0, this.sampleData.length/2) },
    sampleRight: function () { return this.sampleData.slice(this.sampleData.length/2, this.sampleData.length) }
  }
}
</script>
<style lang="sass" scoped>
</style>