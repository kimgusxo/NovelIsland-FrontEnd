<template>
  <div class="ranking">
    <h1>
      <font-awesome-icon style="color: red;" :icon="['fas', 'crown']" />
      랭킹순
    </h1>
    <div class="grid-container">
      <div v-for="(novel, index) in paginatedNovels" :key="index" class="grid-item">
        <div class="grid-item-content">
          <img :src="novel.novelThumbnail" alt="Novel Image" class="image" />
          <p class="title" @click="goToResultPage(novel)" >{{ novel.novelName }}</p>
        </div>
      </div>
    </div>
    <div class="pagination">
      <div class="page-bar">
        <button @click="prevTotalPage" :disabled="this.rankingPageNum === 0">
          <font-awesome-icon :icon="['fas', 'angles-left']" />
        </button>
        <button @click="prevPage" :disabled="currentPage === 1">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </button>
        <div class="page" v-for="page in totalPages" :key="page">
          <button @click="goToPage(page)" :class="{ active: currentPage === page }">{{ page + (this.rankingPageNum * 10) }}</button>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          <font-awesome-icon :icon="['fas', 'angle-right']" />
        </button>
        <button @click="nextTotalPage">
          <font-awesome-icon :icon="['fas', 'angles-right']" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
 
export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 4, // 페이지당 아이템 수를 4개로 설정
    };
  },
  computed: {
    paginatedNovels() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.rankingNovels.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.rankingNovels.length / this.itemsPerPage);
    },
    ...mapState(['rankingNovels', 'rankingPageNum', 'rankingSizeNum']),
  },
  methods: {
    ...mapActions(['fetchRankingNovels']), // action import
    prevTotalPage() {
      if (this.rankingPageNum > 0) {
        this.$store.commit('setRankingPageNum', this.rankingPageNum - 1);
        this.fetchRankingNovels();
      }
    },
    nextTotalPage() {
      this.$store.commit('setRankingPageNum', this.rankingPageNum + 1);
      this.fetchRankingNovels();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    goToResultPage(novel) {
      this.$store.commit('setNovel', novel);
      this.$router.push('/result');
    },
  },
};
</script>

<style scoped>
.ranking {
  text-align: left;
  margin: 30px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.grid-item {
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-item-content {
  text-align: center;
}

.image {
  max-width: 100%;
}

.title {
  margin-top: 5px;
  cursor: pointer;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination button {
  background-color: white;
  color: red;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 18px;
}

.pagination button:disabled {
  background-color: white;
  color: gray;
  cursor: not-allowed;
}

.page-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page {
  margin: 0 5px;
}

.page button {
  font-family: 'bmjua';

  background-color: transparent;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
}

.page button.active {
  font-family: 'bmjua';

  background-color: white;
  color: red;
}

.page-bar button {
  margin: 0 10px;
}
</style>
