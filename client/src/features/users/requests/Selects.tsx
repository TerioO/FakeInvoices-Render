import React from "react";
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import {
    UserRequestsSortOptions,
    SortValues,
    FulfilledValues,
} from "./requestsApiSlice";

type Props1 = {
    className?: string;
    sort: SortValues;
    setSort: React.Dispatch<React.SetStateAction<SortValues>>;
};

const sortOptions: UserRequestsSortOptions = [
    { name: "Most Recent", value: "-createdAt" },
    { name: "Least Recent", value: "createdAt" },
    { name: "Default", value: "N/A" },
];
export function SelectSortRequests({ sort, setSort, className }: Props1) {
    return (
        <FormControl
            variant="standard"
            className={className}
        >
            <InputLabel id="sort-select">Sort</InputLabel>
            <Select
                labelId="sort-select"
                value={sort}
                label="Sort"
                onChange={(e) => setSort(e.target.value as SortValues)}
            >
                {sortOptions.map((el) => (
                    <MenuItem key={`sort-${el.value}`} value={el.value}>
                        {el.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

type Props2 = {
    className?: string;
    fulfilled: FulfilledValues;
    setFulfilled: React.Dispatch<React.SetStateAction<FulfilledValues>>;
};

const fulfilledOptions: FulfilledValues[] = [
    "FULFILLED",
    "REJECTED",
    "PENDING",
    "N/A",
];
export function SelectFulfilledRequests({
    fulfilled,
    setFulfilled,
    className,
}: Props2) {
    return (
        <FormControl
            variant="standard"
            className={className}
        >
            <InputLabel id="fulfilled-select">Fulfilled</InputLabel>
            <Select
                labelId="fulfilled-select"
                value={fulfilled}
                label="Fulfilled"
                onChange={(e) =>
                    setFulfilled(e.target.value as FulfilledValues)
                }
            >
                {fulfilledOptions.map((el) => (
                    <MenuItem key={`fulfilled-${el}`} value={el}>
                        {el}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
