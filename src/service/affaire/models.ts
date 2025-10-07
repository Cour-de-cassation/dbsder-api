import { Filter, ObjectId } from "mongodb"
import { Affaire, ParseError } from "dbsder-api-types"
import { toNotSupported } from "../../library/error";

export function buildAffaireFilter(filters: {
    decisionId?: string;
    numeroPourvoi?: string;
}): Filter<Affaire> {
    try {
        const mongoFilter: Filter<Affaire> = {};
        if (filters.decisionId) {
            mongoFilter.decisionIds = { $in: [new ObjectId(filters.decisionId)] };
        }

        if (filters.numeroPourvoi) {
            mongoFilter.numeroPourvois = { $in: [filters.numeroPourvoi] };
        }

        return mongoFilter;
    } catch (error: unknown) {
        if (error instanceof ParseError) throw toNotSupported('affaire', filters, error)
        else throw error
    }
}