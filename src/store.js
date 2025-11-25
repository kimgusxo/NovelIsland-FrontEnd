import { createStore } from 'vuex';
import axios from 'axios'; // Axios를 import
import router from './router';

const axiosInstance = axios.create({
  // baseURL: 'https://novelisland.duckdns.org',  // 이 부분에 API 서버의 주소와 포트를 설정하세요
  baseURL: 'http://localhost:8081'
});


const store = createStore({
  state: {

    // pagenation
    rankingPageNum: 0,
    rankingSizeNum: 40,

    sortingPageNum: 0,
    sortingSizeNum: 320,

    authorPageNum: 0,
    authorSizeNum: 24,

    bookMarkPageNum: 0,
    bookMarkSizeNum: 32,

    searchNovelPageNum: 0,
    searchNovelSizeNum: 320,

    genreNovelPageNum: 0,
    genreNovelSizeNum: 320,
    
    // user
    userIndex: '',
    userId: '',
    userPassword: '',
    user: {},
    isLoggedIn: false,
    duplicateToken: true,
    
    // novel
    novelId: '',
    novel: {},
    novelIdList: [],
    sortingNovels: [],
    randomNovels: [],
    rankingNovels: [],
    resultNovels: [],

    // author
    authorId: '',
    author: {},
    sortingAuthors: [],

    // genre
    tagId: '',
    tag: {},
    sortingGenres: [],
    selectedGenres: [],

    // bookmark
    bookMarkId: '',
    bookMarkList: [],
    bookMarkNovels: [],
    
    // search
    isSearch: false,
    novelSearchQuery: '',
    authorSearchQuery: '',
    genreSearchQuery: '',
    textArea: '',
  },

  getters: {

    // 다른 게터들...
    getNovel(state) {
      return state.novel;
    },
    getAuthor(state) {
      return state.author;
    },

  },

  mutations: {

    // pagenation
    setRankingPageNum(state, rankingPageNum) {
      state.rankingPageNum = rankingPageNum;
    },
    setSortingPageNum(state, sortingPageNum) {
      state.sortingPageNum = sortingPageNum;
    },
    setAuthorPageNum(state, authorPageNum) {
      state.authorPageNum = authorPageNum;
    },
    setSearchNovelPageNum(state, searchNovelPageNum) {
      state.searchNovelPageNum = searchNovelPageNum;
    },
    setGenreNovelPageNum(state, genreNovelPageNum) {
      state.genreNovelPageNum = genreNovelPageNum;
    },

    // user
    setUserIndex(state, userIndex) {
      state.userIndex = userIndex;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUserPassword(state, userPassword) {
      state.userPassword = userPassword;
    },
    setUser(state, user) {
      state.user = user;
    },
    setLoggedInStatus(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setDuplicateToken(state, duplicateToken) {
      state.duplicateToken = duplicateToken;
    },

    // novel
    setNovelId(state, novelId) {
      state.novelId = novelId;
    },
    setNovel(state, novel) {
      state.novel = novel;
    },
    setNovelIdList(state, novelIdList) {
      state.novelIdList = novelIdList;
    },
    setSortingNovels(state, sortingNovels) {
      state.sortingNovels = sortingNovels;
    },
    setRankingNovels(state, rankingNovels) {
      state.rankingNovels = rankingNovels;
    },
    setRandomNovels(state, randomNovels) {
      state.randomNovels = randomNovels;
    },
    setResultNovels(state, resultNovels) {
      state.resultNovels = resultNovels;
    },

    // author
    setAuthorId(state, authorId) {
      state.authorId = authorId;
    },
    setAuthor(state, author) {
      state.author = author;
    },
    setSortingAuthors(state, sortingAuthors) {
      state.sortingAuthors = sortingAuthors;
    },

    // genre
    setTagId(state, tagId) {
      state.tagId = tagId;
    },
    setTag(state, tag) {
      state.tag = tag;
    },
    setSortingGenres(state, sortingGenres) {
      state.sortingGenres = sortingGenres;
    },
    setSelectedGenres(state, selectedGenres) {
      state.selectedGenres = selectedGenres;
    },

    // bookmark
    setBookMarkId(state, bookMarkId) {
      state.bookMarkId = bookMarkId;
    },
    setBookMarkList(state, bookMarkList) {
      state.bookMarkList = bookMarkList;
    },
    setBookMarkNovels(state, bookMarkNovels) {
      state.bookMarkNovels = bookMarkNovels;
    },

    // search
    setIsSearch(state, isSearch) {
      state.isSearch = isSearch;
    },
    setNovelSearchQuery(state, novelSearchQuery) {
      state.novelSearchQuery = novelSearchQuery;
    },
    setGenreSearchQuery(state, genreSearchQuery) {
      state.genreSearchQuery = genreSearchQuery;
    },
    setAuthorSearchQuery(state, authorSearchQuery) {
      state.authorSearchQuery = authorSearchQuery;
    },
    setTextArea(state, textArea) {
      state.textArea = textArea;
    }
  },

  actions: {
    // login state
    checkLogin({ commit }) {
      const user = localStorage.getItem('user');

      if (user) {
        const parsedUser = JSON.parse(user);
        commit('setUser', parsedUser);
        commit('setLoggedInStatus', true);
        commit('setUserId', parsedUser.userId);
      }
    },


    // user
    login(context) {
      axiosInstance.post('/login/signIn', { 
          userId: context.state.userId, // 검색어를 동적으로 설정하거나 사용자 입력 값을 사용하세요
          userPassword: context.state.userPassword
      })
        .then((response) => {
          const token = response.data.data.jwtToken;
          const refreshToken = response.data.data.refreshJwtToken;

          // 토큰 저장
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);

          // 유저 저장
          localStorage.setItem('user', JSON.stringify(response.data.data));

          context.commit('setUser', response.data.data);
          context.commit('setLoggedInStatus', true); // 로그인 상태를 true로 설정
          router.push('/'); // 리다이렉트
        })
        .catch((error) => {
            alert(error.response.data.message);
        });
    },
    duplicateCheck({ state, commit }) {
      axiosInstance.get('/login/duplicateCheck', {
        params: {
          userId: state.userId,
        }
      })
      .then((response) => {
        const isDuplicate = response.data.data;
        commit('setDuplicateToken', isDuplicate);

        if (!isDuplicate) {
          alert("아이디가 사용가능합니다.");
        } else {
          alert("아이디가 이미 존재합니다.");
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
    },
    signUp(context) {
      axiosInstance.post('/login/signUp', { 
          userId: context.state.userId, // 검색어를 동적으로 설정하거나 사용자 입력 값을 사용하세요
          userPassword: context.state.userPassword
      })
        .then((response) => {
          const token = response.data.data.jwtToken;
          const refreshToken = response.data.data.refreshJwtToken;

          // 토큰 저장
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);

          // 유저 저장
          localStorage.setItem('user', JSON.stringify(response.data.data));

          context.commit('setUser', response.data.data);
          context.commit('setLoggedInStatus', true); // 로그인 상태를 true로 설정
          router.push('/'); // 리다이렉트
        })
        .catch((error) => {
            alert(error.response.data.message);
        });
    },
    updateUser(context) {
      const token = localStorage.getItem('token');
      
      axiosInstance.put('/users', {
        userIndex: context.state.userIndex,
        userId: context.state.userId,
        userPassword: context.state.userPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        context.commit('setUser', response.data.data);
        context.commit('setLoggedInStatus', true); // 로그인 상태를 true로 설정
        router.push('/'); // 리다이렉트
      })
      .catch((error) => {
          alert(error.response.data.message);
      });
    },

    // novel
    fetchSortingNovels(context) {
      axiosInstance.get('/novels/sorted', {
        params: {
          page: context.state.sortingPageNum,
          size: context.state.sortingSizeNum
        }
      })
        .then((response) => {
          context.commit('setSortingNovels', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    fetchGenreNovels(context) {
      axiosInstance.get('/novels/sorted', {
        params: {
          page: context.state.genreNovelPageNum,
          size: context.state.genreNovelSizeNum
        }
      })
        .then((response) => {
          context.commit('setSortingNovels', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    fetchRankingNovels(context) {
      axiosInstance.get('/novels/ranked', {
        params: {
          page: context.state.rankingPageNum, 
          size: context.state.rankingSizeNum
        }
      })
        .then((response) => {
          context.commit('setRankingNovels', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    fetchRandomNovels(context) {
      axiosInstance.get('/novels/random')
        .then((response) => {
          context.commit('setRandomNovels', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },

    // author
    fetchSortingAuthors(context) {
      axiosInstance.get('/authors', {
        params: {
          page: context.state.authorPageNum,
          size: context.state.authorSizeNum
        }
      })
        .then((response) => {
          context.commit('setSortingAuthors', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    searchAuthor(context) {
      axiosInstance.get(`/authors/${context.state.authorId}`)
      .then((response) => {
        context.commit('setAuthor', response.data.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
    },

    // genre
    updateSelectedGenres(context, selectedGenres) {
      context.commit('setSelectedGenres', selectedGenres);
    },
    resetGenres(context) {
      context.state.sortingGenres.forEach(genre => {
        genre.checked = false;
      });
    },
    fetchSortingGenres(context) {
      axiosInstance.get('/tags/sorted')
        .then((response) => {
          context.commit('setSortingGenres', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    searchTag(context) {
      axiosInstance.get(`/tags/${context.state.tagId}`)
      .then((response) => {
        context.commit('setTag', response.data.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
    },

    // bookmark
    searchBookMark(context) {
      const token = localStorage.getItem('token');
      const userIndex = context.state.user.userIndex;
      
      return axiosInstance.get(`/bookmarks/${userIndex}`, {
        params: {
          page: context.state.bookMarkPageNum,
          size: context.state.bookMarkSizeNum,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        context.commit('setBookMarkList', response.data.data);
        return response;
      })
      .catch((error) => {
        alert(error.response.data.message);
        throw error;
      });
    },
    searchNovelsByNovelIdList(context) {
      const token = localStorage.getItem('token');

      return new Promise((resolve, reject) => {
        axiosInstance.get('/novels', {
          params: {
            novelIdList: context.state.novelIdList.join(','),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          context.commit('setBookMarkNovels', response.data.data);
          resolve(response);
        })
        .catch((error) => {
          alert(error.response.data.message);
          reject(error);
        });
      })
    },
    createBookMark(context) {
      const token = localStorage.getItem('token');
      const userIndex = context.state.user.userIndex;
      const novelId = context.state.novelId;

      return new Promise((resolve, reject) => {
        axiosInstance.post(`/bookmarks?userIndex=${userIndex}&novelId=${novelId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          alert(response.data.message);
          resolve(response);
        })
        .catch((error) => {
          alert(error.response.data.message);
          reject(error);
        });
      });
    },
    deleteBookMark(context) {
      const token = localStorage.getItem('token');

      return new Promise((resolve, reject) => {
        axiosInstance.delete(`/bookmarks/${context.state.bookMarkId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          alert(response.data.message);
          resolve(response);
        })
        .catch((error) => {
          alert(error.response.data.message);
          reject(error);
        });
      });
    },

    // search
    searchNovelsInNovelPage(context) {
      axiosInstance.get('/novels/novelName', {
        params: {
          novelName: context.state.novelSearchQuery, // 검색어를 동적으로 설정하거나 사용자 입력 값을 사용하세요
          page: context.state.searchNovelPageNum, // 페이지 번호
          size: context.state.searchNovelSizeNum // 한 페이지에 표시할 항목 수
        }
      })
        .then((response) => {
          context.commit('setSortingNovels', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    searchNovelsInGenrePage(context) {
      const selectedGenreIds = context.state.selectedGenres;
      
      if (selectedGenreIds.length === 0) {
        // selectedGenreIds가 비어있을 때 경고 메시지를 표시하고 함수를 종료
        alert('선택한 장르가 없습니다. 검색을 진행할 수 없습니다.');
        return;
      }
      
      axiosInstance.get('/novels/novelName/and/tagId', {
        params: {
          novelName: context.state.genreSearchQuery,
          tagIdList: selectedGenreIds.join(','),
          page: context.state.genreNovelPageNum, // 페이지 번호
          size: context.state.genreNovelSizeNum // 한 페이지에 표시할 항목 수
        }
      })
        .then((response) => {
          context.commit('setSortingNovels', response.data.data);
          context.commit('setSelectedGenres', []); // 이 부분을 추가합니다.
          context.dispatch('resetGenres'); // 이 부분을 추가합니다.
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    searchNovelsByAuthorId(context) {
      axiosInstance.get('/novels/authorId', {
        params: {
          authorId: context.state.author.authorId, // 검색어를 동적으로 설정하거나 사용자 입력 값을 사용하세요
          page: 0, // 페이지 번호
          size: 320 // 한 페이지에 표시할 항목 수
        }
      })
        .then((response) => {
          context.commit('setSortingNovels', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    searchAuthorsInAuthorPage(context) {
      axiosInstance.get('/authors/authorName', {
        params: {
          authorName: context.state.authorSearchQuery, // 검색어를 동적으로 설정하거나 사용자 입력 값을 사용하세요
          page: 0, // 페이지 번호
          size: 320 // 한 페이지에 표시할 항목 수
        }
      })
        .then((response) => {
          context.commit('setSortingAuthors', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    searchResultNovelsByNovelExplanation(context) {
      axiosInstance.get('/elastics', {
        params: {
          novelExplanation: context.state.textArea,
        }
      })
        .then((response) => {
          context.commit('setResultNovels', response.data.data);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
  }
});

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(undefined, function (error) {
  if (error.response && error.response.status === 401) {
    const originalRequest = error.config;
    if (!originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      return axiosInstance.get('/tokens/refresh', {
        params: {
          userId: store.state.userId, 
          refreshToken: refreshToken 
        }
      })
      .then(response => {
        if (response.status === 200) {
          // 새로운 액세스 토큰을 로컬 스토리지에 저장
          const newToken = response.headers.authorization.replace('Bearer ', '');
          localStorage.setItem('token', newToken);
          const token = localStorage.getItem('token')

          // 실패한 요청 다시 보내기
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      })
      .catch(err => {
        console.error("토큰 갱신 요청 중 에러 발생:", err);
        // 필요에 따라 로그아웃 처리 등 추가 작업을 할 수 있습니다.
      });
    }
  }
  return Promise.reject(error);
});

export default store;