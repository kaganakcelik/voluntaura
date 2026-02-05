import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Opportunity, Cause, TimeCommitment, Availability, LocationType } from './mockData';

export interface QuestionnaireAnswers {
  experienceLevel: 'none' | 'some' | 'lots' | null;
  preferredCauses: Cause[];
  availabilityDays: string[];
  hoursPerWeek: number;
  locationPreference: LocationType | 'either' | null;
  maxDistance: number;
  comfortPreferences: string[];
}

interface FiltersState {
  searchQuery: string;
  causes: Cause[];
  maxDistance: number;
  timeCommitment: TimeCommitment[];
  availability: Availability[];
  locationType: LocationType | 'all';
}

interface VolunteerState {
  // Saved/matched/applied opportunities
  savedOpportunities: string[];
  matchedOpportunities: string[];
  appliedOpportunities: string[];
  completedOpportunities: string[];
  
  // Questionnaire
  questionnaireCompleted: boolean;
  questionnaireAnswers: QuestionnaireAnswers;
  
  // Filters
  filters: FiltersState;
  
  // Progress tracking
  scheduledHours: number;
  goalHours: number;
  
  // Actions
  saveOpportunity: (id: string) => void;
  unsaveOpportunity: (id: string) => void;
  matchOpportunity: (id: string) => void;
  unmatchOpportunity: (id: string) => void;
  applyToOpportunity: (id: string) => void;
  markCompleted: (id: string) => void;
  
  setQuestionnaireCompleted: (completed: boolean) => void;
  setQuestionnaireAnswers: (answers: Partial<QuestionnaireAnswers>) => void;
  
  setFilters: (filters: Partial<FiltersState>) => void;
  clearFilters: () => void;
  
  setGoalHours: (hours: number) => void;
  addScheduledHours: (hours: number) => void;
}

const defaultFilters: FiltersState = {
  searchQuery: '',
  causes: [],
  maxDistance: 25,
  timeCommitment: [],
  availability: [],
  locationType: 'all',
};

const defaultQuestionnaireAnswers: QuestionnaireAnswers = {
  experienceLevel: null,
  preferredCauses: [],
  availabilityDays: [],
  hoursPerWeek: 4,
  locationPreference: null,
  maxDistance: 10,
  comfortPreferences: [],
};

export const useVolunteerStore = create<VolunteerState>()(
  persist(
    (set) => ({
      savedOpportunities: [],
      matchedOpportunities: [],
      appliedOpportunities: [],
      completedOpportunities: [],
      
      questionnaireCompleted: false,
      questionnaireAnswers: defaultQuestionnaireAnswers,
      
      filters: defaultFilters,
      
      scheduledHours: 8,
      goalHours: 20,
      
      saveOpportunity: (id) =>
        set((state) => ({
          savedOpportunities: state.savedOpportunities.includes(id)
            ? state.savedOpportunities
            : [...state.savedOpportunities, id],
        })),
        
      unsaveOpportunity: (id) =>
        set((state) => ({
          savedOpportunities: state.savedOpportunities.filter((i) => i !== id),
        })),
        
      matchOpportunity: (id) =>
        set((state) => ({
          matchedOpportunities: state.matchedOpportunities.includes(id)
            ? state.matchedOpportunities
            : [...state.matchedOpportunities, id],
        })),
        
      unmatchOpportunity: (id) =>
        set((state) => ({
          matchedOpportunities: state.matchedOpportunities.filter((i) => i !== id),
        })),
        
      applyToOpportunity: (id) =>
        set((state) => ({
          appliedOpportunities: state.appliedOpportunities.includes(id)
            ? state.appliedOpportunities
            : [...state.appliedOpportunities, id],
        })),
        
      markCompleted: (id) =>
        set((state) => ({
          completedOpportunities: state.completedOpportunities.includes(id)
            ? state.completedOpportunities
            : [...state.completedOpportunities, id],
        })),
        
      setQuestionnaireCompleted: (completed) =>
        set({ questionnaireCompleted: completed }),
        
      setQuestionnaireAnswers: (answers) =>
        set((state) => ({
          questionnaireAnswers: { ...state.questionnaireAnswers, ...answers },
        })),
        
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
        
      clearFilters: () => set({ filters: defaultFilters }),
      
      setGoalHours: (hours) => set({ goalHours: hours }),
      
      addScheduledHours: (hours) =>
        set((state) => ({
          scheduledHours: state.scheduledHours + hours,
        })),
    }),
    {
      name: 'voluntaura-storage',
    }
  )
);
