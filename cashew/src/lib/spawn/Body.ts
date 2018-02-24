// constant parts are included regardless of available energy
// scaling parts will be added based on available energy
// each part from the scaling part array will be added until there is no more
// energy available. if the array ends and there is still energy left, it will
// loop, if completeScalingPartsOnly is false
export class Body {
    public static fromMemory(memory: BodyMemory) {
        return new this(
            memory.type,
            memory.minimumEnergy,
            memory.constantParts,
            memory.scalingParts,
            memory.maxCompleteScaling,
            memory.completeScalingPartsOnly);
    }

    constructor(
        public type: BodyType,
        public minimumEnergy: number,
        public constantParts: BodyPartConstant[],
        public scalingParts: BodyPartConstant[],
        public maxCompleteScaling: number,
        public completeScalingPartsOnly: boolean) {

        for (var i = 0; i < constantParts.length; i++) 
            this.constantPartCost += BODYPART_COST[constantParts[i]];

        if (this.constantPartCost > minimumEnergy)
            throw Error("Minimum energy cannot be less than constant part cost.");

        for (var i = 0; i < scalingParts.length; i++)
            this.scalingPartCost += BODYPART_COST[scalingParts[i]];        
    }

    public constantPartCost: number;
    public scalingPartCost: number;

    public getBody(energy: number): BodyPartConstant[] {
        if (energy < this.minimumEnergy)
            return null;

        var parts = this.getConstantParts();

        var remainingEnergy = energy - this.constantPartCost;
        var fullParts = Math.floor(remainingEnergy / this.scalingPartCost);
        if (this.maxCompleteScaling > 0)
            fullParts = Math.min(fullParts, this.maxCompleteScaling);

        this.pushFullParts(parts, fullParts);
                       
        if (this.completeScalingPartsOnly)
            return parts;

        remainingEnergy = remainingEnergy - fullParts * this.scalingPartCost;

        return this.pushRemainingParts(parts, remainingEnergy);
    }

    public save(): BodyMemory {
        return {
            type: this.type,
            minimumEnergy: this.minimumEnergy,
            constantParts: this.constantParts,
            scalingParts: this.scalingParts,
            maxCompleteScaling: this.maxCompleteScaling,
            completeScalingPartsOnly: this.completeScalingPartsOnly
        };
    }

    private getConstantParts() {
        var parts: BodyPartConstant[] = [];
        for (var i = 0; i < this.constantParts.length; i++)
            parts.push(this.constantParts[i]);
        return parts;
    }

    private pushFullParts(parts: BodyPartConstant[], fullParts: number): BodyPartConstant[] {
        for (var i = 0; i < fullParts; i++)
            for (var j = 0; j < this.scalingParts.length; j++)
                parts.push(this.scalingParts[j]);
        return parts;
    }

    private pushRemainingParts(parts: BodyPartConstant[], remainingEnergy: number): BodyPartConstant[] {
        for (var i = 0; i < this.scalingParts.length; i++) {
            var cost = BODYPART_COST[this.scalingParts[i]];
            if (cost > remainingEnergy)
                return parts;
            parts.push(this.scalingParts[i]);
            remainingEnergy -= cost;
        }
        return parts; //should never get here
    }
}
