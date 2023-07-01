import React from "react";
import {
    useRouterContext,
    TitleProps,
    useLink,
    useRouterType,
} from "@refinedev/core";

import { realbienesPng } from "assets";

import Button from "@mui/material/Button";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const routerType = useRouterType();
    const Link = useLink();
    const { Link: LegacyLink } = useRouterContext();

    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

    return (
        <Button fullWidth variant="text" disableRipple>
            <ActiveLink to="/">
                {collapsed ? (
                    <img
                        src={realbienesPng}
                        alt="Realbienes logo"
                        width="50px"
                        style={{ maxHeight: "38px",}}
                    />
                ) : (
                    <img
                        src={realbienesPng}
                        alt="Realbienes logo"
                        width="140px"
                        style={{ maxHeight: "38px", fontWeight: 'bolder'}}
                    />
                )}
            </ActiveLink>
        </Button>
    );
};
