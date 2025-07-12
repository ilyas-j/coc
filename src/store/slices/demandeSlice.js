import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { demandeService } from '../../services/demandeService';

// Actions asynchrones
export const fetchMesDemandesImportateur = createAsyncThunk(
  'demandes/fetchMesDemandesImportateur',
  async (_, { rejectWithValue }) => {
    try {
      const response = await demandeService.getMesDemandesImportateur();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchDemandesAgent = createAsyncThunk(
  'demandes/fetchDemandesAgent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await demandeService.getDemandesAgent();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const creerNouvelleDemande = createAsyncThunk(
  'demandes/creerNouvelleDemande',
  async (demandeData, { rejectWithValue }) => {
    try {
      const response = await demandeService.creerDemande(demandeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const demandeSlice = createSlice({
  name: 'demandes',
  initialState: {
    demandes: [],
    isLoading: false,
    error: null,
    currentDemande: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDemande: (state, action) => {
      state.currentDemande = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch mes demandes importateur
      .addCase(fetchMesDemandesImportateur.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMesDemandesImportateur.fulfilled, (state, action) => {
        state.isLoading = false;
        state.demandes = action.payload;
      })
      .addCase(fetchMesDemandesImportateur.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch demandes agent
      .addCase(fetchDemandesAgent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDemandesAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.demandes = action.payload;
      })
      .addCase(fetchDemandesAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Créer nouvelle demande
      .addCase(creerNouvelleDemande.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(creerNouvelleDemande.fulfilled, (state, action) => {
        state.isLoading = false;
        state.demandes.push(action.payload);
      })
      .addCase(creerNouvelleDemande.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentDemande } = demandeSlice.actions;
export default demandeSlice.reducer;