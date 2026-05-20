import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../services/productService";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const res = await productService.getProducts(1, 20);
      return {
        products: res?.documents || [],
        pagination: {
          page: res.page,
          hasMore: res.hasNext,
          totalPages: res.totalPages,
          total: res.total
        }
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchMoreProducts = createAsyncThunk(
  "products/fetchMoreProducts",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const currentPage = state.products.pagination.page;
    const hasMore = state.products.pagination.hasMore;

    if (!hasMore) {
      return { products: [], pagination: state.products.pagination };
    }

    try {
      const res = await productService.getProducts(currentPage + 1, 20);
      return {
        products: res?.documents || [],
        pagination: {
          page: res.page,
          hasMore: res.hasNext,
          totalPages: res.totalPages,
          total: res.total
        }
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch one product
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, thunkAPI) => {
    try {
      const res = await productService.getProduct(productId);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  "products/fetchMyProducts",
  async (_, thunkAPI) => {
    try {
      const res = await productService.getMyProducts();
      return {
        products: res?.documents || [],
        pagination: { page: 1, hasMore: false, totalPages: 1, total: res?.documents?.length || 0 }
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    myProducts: [], // separate list for profile page (all user's products)
    selectedProduct: null,
    loading: false,      // initial fetch loading
    error: null,
    filters: {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    },
    pagination: {
      page: 1,
      hasMore: true,
      totalPages: 1,
      total: 0
    },
    isLoadingMore: false
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProducts: (state) => {
      state.products = [];
      state.pagination = { page: 1, hasMore: true, totalPages: 1, total: 0 };
      state.isLoadingMore = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset products and pagination when filters change
      state.products = [];
      state.pagination = { page: 1, hasMore: true, totalPages: 1, total: 0 };
    }
  },
  extraReducers: (builder) => {
    builder
      // all products (initial load)
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.loading = false;
        state.isLoadingMore = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.isLoadingMore = false;
      })

      // fetch more products (infinite scroll)
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.products = [...state.products, ...action.payload.products];
        state.pagination = action.payload.pagination;
        state.isLoadingMore = false;
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoadingMore = false;
      })

      // single product
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // my products (for profile)
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myProducts = action.payload.products;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct, setFilters, resetProducts } = productSlice.actions;
export default productSlice.reducer;
