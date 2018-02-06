// fluent test framework? 

/*
given.CONTEXT
.when.SUBJECT
.is.CONDITION
.then.ACTION

given.PROC_CONFIG
.when.SETUP
.is.OK
.then.CONTINUE


given
    .theContextOf(del: () => TContext)

.when
    .the(del: (context) => TSubject)

.is
    .equalTo(otherSubect: TSubject) // checks if the current subject is equal to the provided otherSubject
    .notEqualTo(enum.SecondMember: TSubject) // inverse of equalTo
    .null
    .undefined
    .notNull
    .notUndefined
    .nullOrUndefined
    .definedAndAssigned
    .in(arrayToCheck: TSubject[]) // checks by ref equality if the selected subject is present in the given array
    .like(del: (subject) => boolean) // .like(s => s.isRunning) checks arbitrary boolean condition(s)

.then
    .execute
        .actionCalled('').which(del: (subj) => void)
    .throw
    .doNothing

.whenIt

*/


interface Given {

}

interface When {

}

interface WhenIt {

}

interface It {

}

interface Is {

}

interface Then {

}


interface Context<T> {

}

interface Condition<TSubject> {

}

interface Subject<T> {

}

interface Action<TSubject> {
    name?: string;
    actionDelegate: (subject: TSubject) => void;
}

interface ContextSelector<TContext> {

}

interface SubjectSelector<TSubject> {

}

interface ConditionSelector<TCondition> {

}

interface ActionSelector<TSubjectType, TSubject extends Subject<TSubjectType>, TAction extends Action<TSubject>> {    
    //actionSelectedDelegate: (action: TAction) => void;      

    actionCalled(name: string): void;

    do(delegate: (subject: TSubjectType) => void): void;
}

/** what a name */
interface ActionDeclarator<TSubjectType, TSubject extends Subject<TSubjectType>, TAction extends Action<TSubject>> {
    which(delegate: (subject: TSubjectType) => void): WhenIt;
}