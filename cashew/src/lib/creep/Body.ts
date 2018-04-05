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
            memory.completeScalingPartsOnly,
            memory.waitForFullEnergy);
    }

    public static getBodyCost(parts: BodyPartConstant[]): number {
        let cost = 0;
        for (var i = 0; i < parts.length; i++)
            cost += BODYPART_COST[parts[i]];
        return cost;
    }

    
    constructor(
        type: BodyType,
        minimumEnergy: number,
        constantParts: BodyPartConstant[],
        scalingParts: BodyPartConstant[],
        maxCompleteScalingSections: number,
        completeScalingPartsOnly: boolean,
        waitForFullEnergy?: boolean) {
        this.type = type;
        this.minimumEnergy = minimumEnergy;
        this.constantParts = constantParts;
        this.scalingParts = scalingParts;
        this.maxCompleteScalingSections = maxCompleteScalingSections;
        this.completeScalingPartsOnly = completeScalingPartsOnly;
        this.waitForFullEnergy = waitForFullEnergy;

        for (var i = 0; i < this.constantParts.length; i++) 
            this.constantPartCost += BODYPART_COST[this.constantParts[i]];

        if (this.constantPartCost > minimumEnergy)
            throw Error(`Body ${type} error: Minimum energy [${minimumEnergy}] cannot be less than constant part cost [${this.constantPartCost}].`);

        for (var i = 0; i < this.scalingParts.length; i++)
            this.scalingPartCost += BODYPART_COST[this.scalingParts[i]];        
    }

    public type: BodyType;
    public minimumEnergy: number;
    public constantParts: BodyPartConstant[];
    public scalingParts: BodyPartConstant[];
    public maxCompleteScalingSections: number;
    public completeScalingPartsOnly: boolean;
    public waitForFullEnergy: boolean;

    public constantPartCost: number = 0;
    public scalingPartCost: number = 0;

    /** The most energy that this body could consume. */
    public get maximumEnergy(): number {
        if (!this.scalingParts || !this.scalingParts.length)
            return Body.getBodyCost(this.constantParts);
        let body = this.getBody(60 * 200);
        return Body.getBodyCost(body);
    }


    public getBody(energy: number): BodyPartConstant[] {
        if (energy < this.minimumEnergy)
            return null;

        var parts = this.getConstantParts();
        if (this.scalingPartCost == 0)
            return this.orderParts(parts);

        var remainingEnergy = energy - this.constantPartCost;

        var fullScalingSections = Math.floor(remainingEnergy / this.scalingPartCost);
        if (this.maxCompleteScalingSections > 0)
            fullScalingSections = Math.min(fullScalingSections, this.maxCompleteScalingSections);
        if (parts.length + fullScalingSections * this.scalingParts.length > 50)
            fullScalingSections = Math.floor((50 - parts.length) / this.scalingParts.length);        
        
        this.pushFullParts(parts, fullScalingSections);
                       
        if (this.completeScalingPartsOnly)
            return this.orderParts(parts);

        remainingEnergy = remainingEnergy - fullScalingSections * this.scalingPartCost;

        parts = this.pushRemainingParts(parts, remainingEnergy);
        return this.orderParts(parts);
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
            if (parts.length >= 50)
                return parts;

            var cost = BODYPART_COST[this.scalingParts[i]];
            if (cost > remainingEnergy)
                return parts;

            parts.push(this.scalingParts[i]);
            remainingEnergy -= cost;
        }
        return parts; //should never get here
    }

    private orderParts(parts: BodyPartConstant[]): BodyPartConstant[] {
        let tough = 0;
        let move = 0;
        let other = [];

        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == MOVE)
                move++;
            else if (parts[i] == TOUGH)
                tough++;
            else
                other.push(parts[i]);
        }

        let ordered = [];
        let half = Math.floor(move / 2);
        let remainder = move - half;
        for (var i = 0; i < tough; i++)
            ordered.push(TOUGH);
        for (var i = 0; i < half; i++)
            ordered.push(MOVE);
        for (var i = 0; i < other.length; i++)
            ordered.push(other[i]);
        for (var i = 0; i < remainder; i++)
            ordered.push(MOVE);

        return ordered;
    }

    public save(): BodyMemory {
        return {
            type: this.type,
            minimumEnergy: this.minimumEnergy,
            constantParts: this.constantParts,
            scalingParts: this.scalingParts,
            maxCompleteScaling: this.maxCompleteScalingSections,
            completeScalingPartsOnly: this.completeScalingPartsOnly,
            waitForFullEnergy: this.waitForFullEnergy
        };
    }
}
