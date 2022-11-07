# CP Progress Tracker Site

![Builds Status](https://github.com/smtnhacker/cp-problems/actions/workflows/running-tests.yml/badge.svg)

[Live Site Link](https://fave-cp-prob.web.app/)

A site that can be used to track competitive programming progress. Its primary use is to track skills and suggest problems depending on skill level.

![Dashboard](https://raw.githubusercontent.com/smtnhacker/cp-problems/main/docs/assets/main.PNG)

But, you can also share your insights regarding the problems you have solved! 

![Blog](https://raw.githubusercontent.com/smtnhacker/cp-problems/main/docs/assets/blog.PNG)

_Note: The blogging feature is currently in experimental stage so it is still very buggy._

Currently, the site supports CodeForces account syncing and its tags and difficulty scale is based on CodeForces', but other online judges may be incorporated in the future!

## About the Project

I started this project as a practice for CI/CD, front-end only web app, as well as testing (this is the first project I've made that has testing). Implementing the entire stack is great if you want customizability and control; however, for common use-cases, I thought that it might be cheaper, faster, and on the long term, easier if I could use services such as Firebase. 

### How I worked on the project

Initially, I had to build my own backend server to have a good control while developing the early stages of the app. I used React for the frontend, since that's what I'm currently comfortable with. Since I was mainly dealing with API calls and I know I will mainly be dealing with data and types manipulation, I opted to use Typescript so that I can avoid those `undefined has no property` errors and ensure that I'm using my data correctly. To improve performance, I used React-Redux as my store and I implemented plenty of thunks and async thunks. I also used caching to reduce the number of data uploads and downloads, thereby greatly reducing the financial cost and improving performance! For testing, I used Jest since it was made primarily for React.

### How to navigate this project

Most of the work is in the `client\src` folder. The `model` folder contains the classes for interacting with the APIs. The `features` folder contains the different Redux Slices. The `components` folder contains the various React components. The `routes` folder contains the wrapper component for each major route. The `util` folder contains the different utility functions used for manipulating the data. Since I'm using Jest, the test files are found in `__mocks__` folders and are also files that end in `.spec.(t|j)sx?`.

### Why this project structure

Since it's my first time using Redux and Jest, I opted to group the files by their type (Redux Slice, utility, model classes, etc). This helped me understand their patterns since I had their files side-by-side. I also opted to create classes to handle API calls since I wanted to try and force an MVP architecture pattern on the project. By having these model classes, I am assured that I will know when and where data will be uploaded to and downloaded from Firebase, and other API endpoints. This helped in making my workflow consistent and generally, free of bugs caused by _mysterious data appearing out of nowhere_.

### Possible Improvements

Aside from the lack of features, this project can also be improved by standardizing where types are to be located. Right now, they're all over the place since I added them as I needed them. There's also work to be done in improving how and when I download and update data (recall that I'm using cache and redux to improve performance as much as possible).

## Roadmap

Currently, the project is still in its alpha, so it's still very buggy (I plan on fixing essential bugs, of course). It's currently not released for mass usage yet so it has very limiting restrictions, such as currently only having a max of 100 users and very small bandwidth. Depending on how it goes, I may release it for general use. 

It is still a side project so development may be slow, but I still intend to add the following features:

- [ ] Mobile Support
- [ ] Inline KaTex
- [ ] Filter / Search Bar in the My Problems section

The project still lacks numerous features, so I'm thinking of adding these, but it's not guaranteed since adding a new feature can be quite a commitment.

- [ ] AtCoder API Support
- [ ] CodeChef API Support
- [ ] Automatic Fetching of recent submissions
- [ ] Viewing of another user's skill set
- [ ] Subtags (such as having MST under Graphs, Centroid Decomposition under DS, etc...)
- [ ] Language-specific code blocks
- [ ] More Login/Signup options
- [ ] Submission History (by tags)

Due to lack of resources and/or interest, the following features are unlikely to be added:

- [ ] Uploading of any kind of resources (such as images)
- [ ] Comments system
- [ ] Contest Tracker

## Contribution

I accept any kind of contribution, may it be through raising issues, Pull Request, or even financial contributions! 

## License

_TO-DO_