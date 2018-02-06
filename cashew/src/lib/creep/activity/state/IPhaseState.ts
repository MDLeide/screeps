export interface IPhaseState {
    name: string;
    currentIndex: number;
    activityIds: string[];
    invalid: boolean;
}