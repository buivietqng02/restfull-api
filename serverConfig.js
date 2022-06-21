const serverConfig = {

    port: +process.env.SERVER_PORT || 8080,
    routes: {

      apiFilesPost: '/api/files',
      getProfileInfo: '/api/users/me',

        // name and path your routes
    },
    errorMessages: {
        someWrong: 'Something went wrong!',
        missingNameOrContent: 'Missing name or content',
    },
};
module.export= serverConfig
