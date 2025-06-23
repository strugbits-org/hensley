import { proxy } from 'valtio';

export const storeState = proxy({
    roles: []
});

export const storeActions = {
    addRole: (role) => {
        if (!storeState.roles.includes(role)) {
            storeState.roles.push(role);
        }
    },
    removeRole: (role) => {
        storeState.roles = storeState.roles.filter(r => r !== role);
    },
    clearRoles: () => {
        storeState.roles = [];
    },
    setRoles: (roles) => {
        storeState.roles = roles;
    },
    getRoles: () => storeState.roles,
    getRole: (role) => storeState.roles.find(r => r === role)
};
