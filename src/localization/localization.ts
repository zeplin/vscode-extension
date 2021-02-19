import BarrelType from "../common/domain/barrel/BarrelType";
import RepositoryType from "../coco/repository/model/RepositoryType";

/**
 * Localization object that contains this extension's all user visible texts that may be relative to locale (except
 * those in package.json).
 */
const localization = {
    coco: {
        barrel: {
            personalWorkspace: "Personal Workspace",
            added: (type: BarrelType) => `Added ${barrelLower(type)} to configuration file.`,
            notFound: (type: BarrelType) => `${barrel(type)} not found, make sure the identifier is correct`,
            formatNotValid: (type: BarrelType) =>
                `${barrel(type)} ids must be exactly 24 characters long and hexadecimal.`,
            propInfo: (type: BarrelType) => `${barrel(type)} identifiers that you want to use components from`,
            propExtraInfo: (type: BarrelType) =>
                `You can find the identifier of a ${barrelLower(type)} in the URL once you open it in the Web app.`
        },
        component: {
            writeFileName: "Start typing component file name to add",
            configNotFound: (folderName: string) => `Please create Zeplin configuration file first for ${folderName}`,
            configsNotFound: `Please create Zeplin configuration file first for required workspace folders`,
            createConfigAndAdd: "Create Config and Add component",
            createConfigsAndAdd: "Create Configs and Add components",
            alreadyAdded: "Selected component file is already added.",
            add: "Add component",
            added: "Component added to configuration file.",
            addMultiple: "Add components",
            addedMultiple: (count: number) => `${pluralize(count, "component")} added to configuration file.`,
            goToFile: "Go to component file",
            zeplinComponentCount: (count: number) => `Connected to ${pluralize(count, "Zeplin Component")}`,
            componentNotFound: "Component file does not exist.",
            propInfo:
                "List of components in the codebase with their design counterparts—this is where the magic happens.",
            propNameInfo: "Custom name for the component to be displayed in Zeplin.",
            propPathInfo: "The file path for the component file.",
            propZeplinIdsInfo: "Component ids in Zeplin to connect to, either one or more.",
            propZeplinNamesInfo: "Names of the components in Zeplin to connect to, either one or more.",
            propCustomLinkTitle: "Custom link type you defined under `links`",
            propCustomLinkInfo: "`type` of the custom link type you defined.",
            propCustomLinkUrlPathInfo:
                "URL path for the component to append to the end of the base url defined under `links`.",
            propStyleguidistInfo: "Styleguidist specific information for the component.",
            propStyleguidistKindInfo: "The last part that start with `#` of the styleguidist component url.",
            propStorybookInfo: "Storybook specific information for the component.",
            propStorybookExtraInfo: "This property is required for the manual Storybook integration if your workflow doesn't appropriate with the Storybook plugin.",
            propStorybookKindInfo: "Name defined under `.stories.js` of a component.",
            propStorybookStoriesInfo: "Names of stories defined under `.stories.js` of a component."
        },
        config: {
            custom: {
                setConfig: "Set as Zeplin configuration file",
                noFileSelected: "No file selected.",
                alreadySet: "Selected file is already a configuration file.",
                fileNotSaved: "Selected file is not saved, please save it before continuing.",
                fileNotValid: "Selected file is not valid as a Zeplin configuration, please review it before continuing.",
                set: "File set as Zeplin configuration. The root is still the same. Would you like to select a custom root?",
                defaultConfigRootCannotBeChanged: "You cannot change default Zeplin configuration file's root.",
                nonConfigSelected: "Selected file is not a Zeplin configuration.",
                currentRoot: (path: string) => `Zeplin root: ${path}`,
                setRoot: "Set root for Zeplin configuration file",
                defaultConfigCannotBeUnset: "You cannot unset a default Zeplin configuration file.",
                rootSet: "Folder set as root for Zeplin configuration file",
                unset: "File unset as Zeplin configuration."
            },
            update: {
                rootSet: "Folder set as root for Zeplin configuration file",
                moved: "Zeplin configuration file moved.",
                removed: "Zeplin configuration file removed."
            },
            create: {
                selectFolder: "Select folder to create Zeplin configuration file",
                noWorkspaceFound: "Please open a workspace first to create a Zeplin configuration file.",
                allFoldersHaveConfig: "All folders already have a Zeplin configuration file."
            },
            open: {
                selectConfig: "Select Zeplin configuration file to open",
                noWorkspaceFound: "Please open a workspace first to open a Zeplin configuration file."
            },
            info: {
                dirty: "Save to see statistics",
                notValid: "Config is not valid",
                projectCount: (count: number) => pluralize(count, "Project"),
                styleguideCount: (count: number) => pluralize(count, "Styleguide"),
                componentCount: (count: number) => pluralize(count, "Component"),
                zeplinComponentCount: (count: number) => pluralize(count, "Zeplin Component")
            }
        },
        plugin: {
            add: "Add Plugin",
            added: "Added plugin to configuration file.",
            propInfo: "Plugins' information that you want to use while analyzing your components.",
            propExtraInfo: "This is an alternative way of CLI command usage like `-p {pluginName}`",
            propNameInfo: "Plugin name you want to use. e.g. `@zeplin/cli-connect-storybook-plugin`",
            propConfigInfo: "Specific data for the plugin. Zeplin CLI sends this value directly to the plugin itself. You can learn more from the plugin's documentation you use."
        },
        link: {
            add: "Add custom link",
            added: "Added custom link to configuration file.",
            propInfo: "List of external links like Storybook, Styleguidist, internal wiki and so on.",
            propNameInfo: "Optional custom name for the link.",
            propTypeInfo: "Type of the url, either `styleguidist` or a custom link type you define, e.g. `wiki`.",
            propTypeExtraInfo: "`storybook` removed with CLI version 0.4.0",
            propUrlInfo: "Base url for the link."
        },
        repository: {
            type: (type: RepositoryType) => repository(type),
            selectType: "Select repository type",
            add: "Add repository",
            alreadyAdded: (type: RepositoryType) => `${repository(type)} repository is already added.`,
            added: (type: RepositoryType) => `Added ${repository(type)} repository to configuration file.`,
            propInfo: (type: RepositoryType) => `${repository(type)} specific information for all components.`,
            propBranchInfo: (type: RepositoryType) =>
                `Branch in ${repository(type)} you want to reference, default is \`master\`.`,
            propRepositoryInfo: (type: RepositoryType) =>
                `Name of the repository in ${repository(type)}, e.g. \`zeplin/project\`.`,
            propUrlInfo: (defaultUrl: string) => `Default is ${defaultUrl}`
        },
        zeplinComponent: {
            noValidBarrelFound: "Please add a valid project or styleguide to configuration file first.",
            noComponentFound: "Please add a component file to configuration file first.",
            noBarrelFound: "No project or styleguide found",
            selectBarrel: "Select project or styleguide",
            noZeplinComponentFound: "No Zeplin component found",
            selectZeplinComponent: "Select Zeplin Component",
            selectComponent: "Select component file",
            joinBarrel: "Please join first.",
            join: "Join",
            connected: (count: number) => `Connected to ${pluralize(count, "Zeplin Component")}.`,
            connect: "Connect to Zeplin components",
            askMigration: "Would you like to migrate zeplinNames on configuration file to zeplinIds?",
            migrate: "Migrate Zeplin component names to ids",
            migrationInProgress: "Getting components data for migration…",
            noBarrelFoundForMigration: "No project or styleguide found on configuration file.",
            noComponentFoundForMigration: "No component found on configuration file.",
            noNameFoundForMigration: "No Zeplin component name found on configuration file.",
            barrelErrorForMigration: "Zeplin components data could not be fetched. Please check your projects and styleguides on configuration file.",
            noZeplinComponentFoundOnBarrelsForMigration: "No Zeplin components found. Please check your projects and styleguides on configuration file whether they have any components or not.",
            migrated: (count: number) => `Migrated ${pluralize(count, "Zeplin component name")}.`,
            migrationErrors: (count: number) => `${pluralize(count, "Zeplin component name")} can not be migrated because matching Zeplin component ids can not be found. Please check whether component names still exist on Zeplin or not.`,
            notFound: (descriptor: string) =>
                `No component matching “${descriptor}” in projects or styleguides you’re a member of`,
            formatNotValid: "Zeplin component ids must be exactly 24 characters long and hexadecimal.",
            moreItems: (count: number) => `${count} more`
        },
        common: {
            noConfigFound: "Please create a Zeplin configuration file first.",
            notInWorkspace: "Selected file is not in the same root folder as Zeplin configuration file",
            createConfig: "Create Config",
            configInvalid: "Zeplin configuration file is invalid, please review it before continuing.",
            configsInvalid: "Some of the Zeplin configuration files are invalid, please review them before continuing.",
            configNotSaved: "Zeplin configuration file is not saved, please save it before continuing.",
            configsNotSaved: "Some of the Zeplin configuration files are not saved, please save them before continuing."
        }
    },
    session: {
        askLogin: "Login to Zeplin?",
        loggedIn: "You are now logged in.",
        enterToken: "Enter Zeplin authentication token",
        notLoggedIn: "You are not logged in.",
        askLogout: "Log out from Zeplin?",
        logoutSuccessful: "You are now logged out.",
        loginToZeplin: "Login to Zeplin",
        login: "Login",
        logout: "Logout",
        authenticateWithToken: "Authenticate with Token",
        clearCache: "Clear Cache",
        cacheCleared: "Cache cleared."
    },
    sidebar: {
        activity: {
            noneFound: "No activity yet.",
            errors: "Errors",
            componentsError: (barrelId: string) => `Fetching components (${barrelId}) failed.`,
            screensError: (barrelId: string) => `Fetching screens (${barrelId}) failed.`,
            updated: (item: string) => `${item} updated.`,
            updatedByUser: (user: string, item: string) => `${user} updated ${item}.`,
            minutesAgo: (count: number) => `${count}m`,
            hoursAgo: (count: number) => `${count}h`,
            daysAgo: (count: number) => `${count}d`,
            today: "Today",
            yesterday: "Yesterday",
            thisWeek: "This week",
            lastWeek: "Last week",
            thisMonth: "This month",
            lastMonth: "Last month",
            monthName: (date: Date) => getMonthName(date.getMonth()),
            monthNameYear: (date: Date) => `${getMonthName(date.getMonth())} ${date.getFullYear()}`
        },
        barrel: {
            projects: "Projects",
            styleguides: "Styleguides",
            addAnother: "Add another project or styleguide",
            selectType: "Add project or styleguide?",
            addProject: "Add project",
            addStyleguide: "Add styleguide",
            added: (type: BarrelType) => `Added ${barrelLower(type)}.`,
            emptyInfo: "Add project/styleguide from “…” menu"
        },
        jira: {
            open: "Open Jira issue",
            select: "Select Jira issue"
        },
        jumpTo: {
            jumpToItem: "Jump to screen or component",
            selectItem: "Select screen or component",
            noItemFound: "No screen or component found"
        },
        openInZeplin: {
            selectPreferred: "Select where to open Zeplin resources",
            web: "Open in Web",
            app: "Open in App"
        },
        pin: {
            selectProject: "Select project",
            noProjectFound: "Please add a project first.",
            pinScreen: "Pin screen",
            pinComponent: "Pin component",
            selectScreen: "Select screen",
            selectComponent: "Select component",
            askUnpinAll: "Unpin all items?",
            emptyInfo: "Pin screens or components from “…” menu."
        },
        screen: {
            screens: "Screens",
            noneFound: "No screen yet."
        },
        zeplinComponent: {
            localStyleguide: "Local Styleguide",
            noneFound: "No component yet."
        },
        common: {
            selectBarrel: "Select project or styleguide",
            noBarrelFound: "Please add a project or styleguide first."
        }
    },
    common: {
        barrel: {
            noWorkspaceFound: "No workspace found",
            selectWorkspace: "Select Zeplin workspace",
            noneFound: (type: BarrelType) => `No ${barrelLower(type)} found`,
            select: (type: BarrelType, workspace: string) => `Select ${barrelLower(type)} from ${workspace}`,
            add: (type: BarrelType) => `Add ${barrelLower(type)}`,
            alreadyAdded: (type: BarrelType) => `Selected ${barrelLower(type)} is already added.`,
            barrel
        },
        zeplinComponent: {
            zeplinComponents: "Components"
        },
        ok: "OK",
        cancel: "Cancel",
        yes: "Yes",
        no: "No",
        wrongUri: "Handling URI failed.",
        selectFolder: "Select a Zeplin configuration file",
        defaultError: "We're experiencing a problem here, please try again in a little while.",
        refresh: "Refresh",
        noItemFound: "No item found",
        clickToRefresh: "Click to refresh",
        restrictedMember: "Organization member is restricted. Please contact your organization admins.",
        optional: "Optional",
        childProperties: "Child properties"
    }
};

function pluralize(count: number, text: string) {
    const suffix = count === 1 ? "" : "s";
    return `${count} ${text}${suffix}`;
}

function barrel(type: BarrelType): string {
    switch (type) {
        case BarrelType.Project:
            return "Project";
        case BarrelType.Styleguide:
            return "Styleguide";
        default:
            throw new Error(`Unhandled barrel type: ${type}`);
    }
}

function barrelLower(type: BarrelType): string {
    switch (type) {
        case BarrelType.Project:
            return "project";
        case BarrelType.Styleguide:
            return "styleguide";
        default:
            throw new Error(`Unhandled barrel type: ${type}`);
    }
}

function repository(type: RepositoryType): string {
    switch (type) {
        case RepositoryType.Github:
            return "GitHub";
        case RepositoryType.Gitlab:
            return "GitLab";
        case RepositoryType.Bitbucket:
            return "Bitbucket";
        default:
            throw new Error(`Unhandled repository type: ${type}`);
    }
}

function getMonthName(month: number) {
    return [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ][month];
}

export default localization;
