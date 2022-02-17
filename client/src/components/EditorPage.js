import React, { useState, useEffect, Fragment } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AceEditor from 'react-ace';
import { browserHistory, Redirect } from 'react-router-dom'
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/theme-clouds";
//import Flowchart from 'react-simple-flowchart';
// import "ace-builds/src-noconflict/mode-jsx";
/*eslint-disable no-alert, no-console */
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

const languages = [
    "abap",
    "abc",
    "actionscript",
    "ada",
    "alda",
    "apache_conf",
    "apex",
    "applescript",
    "aql",
    "asciidoc",
    "asl",
    "assembly_x86",
    "autohotkey",
    "batchfile",
    "c9search",
    "cirru",
    "clojure",
    "cobol",
    "coffee",
    "coldfusion",
    "crystal",
    "csharp",
    "csound_document",
    "csound_orchestra",
    "csound_score",
    "csp",
    "css",
    "curly",
    "c_cpp",
    "d",
    "dart",
    "diff",
    "django",
    "dockerfile",
    "dot",
    "drools",
    "edifact",
    "eiffel",
    "ejs",
    "elixir",
    "elm",
    "erlang",
    "forth",
    "fortran",
    "fsharp",
    "fsl",
    "ftl",
    "gcode",
    "gherkin",
    "gitignore",
    "glsl",
    "gobstones",
    "golang",
    "graphqlschema",
    "groovy",
    "haml",
    "handlebars",
    "haskell",
    "haskell_cabal",
    "haxe",
    "hjson",
    "html",
    "html_elixir",
    "html_ruby",
    "ini",
    "io",
    "jack",
    "jade",
    "java",
    "javascript",
    "json",
    "json5",
    "jsoniq",
    "jsp",
    "jssm",
    "jsx",
    "julia",
    "kotlin",
    "latex",
    "latte",
    "less",
    "liquid",
    "lisp",
    "livescript",
    "logiql",
    "logtalk",
    "lsl",
    "lua",
    "luapage",
    "lucene",
    "makefile",
    "markdown",
    "mask",
    "matlab",
    "maze",
    "mediawiki",
    "mel",
    "mips",
    "mixal",
    "mushcode",
    "mysql",
    "nginx",
    "nim",
    "nix",
    "nsis",
    "nunjucks",
    "objectivec",
    "ocaml",
    "pascal",
    "perl",
    "pgsql",
    "php",
    "php_laravel_blade",
    "pig",
    "plain_text",
    "powershell",
    "praat",
    "prisma",
    "prolog",
    "properties",
    "protobuf",
    "puppet",
    "python",
    "qml",
    "r",
    "raku",
    "razor",
    "rdoc",
    "red",
    "redshift",
    "rhtml",
    "rst",
    "ruby",
    "rust",
    "sass",
    "scad",
    "scala",
    "scheme",
    "scrypt",
    "scss",
    "sh",
    "sjs",
    "slim",
    "smarty",
    "smithy",
    "snippets",
    "soy_template",
    "space",
    "sparql",
    "sql",
    "sqlserver",
    "stylus",
    "svg",
    "swift",
    "tcl",
    "terraform",
    "tex",
    "text",
    "turtle",
    "twig",
    "typescript",
    "vala",
    "vbscript",
    "velocity",
    "verilog",
    "vhdl",
    "visualforce",
    "wollok",
    "xml",
    "xquery",
    "yaml",
    "zeek"
];

const themes = [
    "ambiance",
    "chaos",
    "chrome",
    "clouds",
    "clouds_midnight",
    "cobalt",
    "crimson_editor",
    "dawn",
    "dracula",
    "dreamweaver",
    "eclipse",
    "github",
    "gob",
    "gruvbox",
    "idle_fingers",
    "iplastic",
    "katzenmilch",
    "kr_theme",
    "kuroir",
    "merbivore",
    "merbivore_soft",
    "monokai",
    "mono_industrial",
    "nord_dark",
    "one_dark",
    "pastel_on_dark",
    "solarized_dark",
    "solarized_light",
    "sqlserver",
    "terminal",
    "textmate",
    "tomorrow",
    "tomorrow_night",
    "tomorrow_night_blue",
    "tomorrow_night_bright",
    "tomorrow_night_eighties",
    "twilight",
    "vibrant_ink",
    "xcode"
];

const compiler_languages = [
    {
        "id": 45,
        "name": "Assembly (NASM 2.14.02)"
    },
    {
        "id": 46,
        "name": "Bash (5.0.0)"
    },
    {
        "id": 47,
        "name": "Basic (FBC 1.07.1)"
    },
    {
        "id": 48,
        "name": "C (GCC 7.4.0)"
    },
    {
        "id": 52,
        "name": "C++ (GCC 7.4.0)"
    },
    {
        "id": 49,
        "name": "C (GCC 8.3.0)"
    },
    {
        "id": 53,
        "name": "C++ (GCC 8.3.0)"
    },
    {
        "id": 50,
        "name": "C (GCC 9.2.0)"
    },
    {
        "id": 54,
        "name": "C++ (GCC 9.2.0)"
    },
    {
        "id": 51,
        "name": "C# (Mono 6.6.0.161)"
    },
    {
        "id": 55,
        "name": "Common Lisp (SBCL 2.0.0)"
    },
    {
        "id": 56,
        "name": "D (DMD 2.089.1)"
    },
    {
        "id": 57,
        "name": "Elixir (1.9.4)"
    },
    {
        "id": 58,
        "name": "Erlang (OTP 22.2)"
    },
    {
        "id": 44,
        "name": "Executable"
    },
    {
        "id": 59,
        "name": "Fortran (GFortran 9.2.0)"
    },
    {
        "id": 60,
        "name": "Go (1.13.5)"
    },
    {
        "id": 61,
        "name": "Haskell (GHC 8.8.1)"
    },
    {
        "id": 62,
        "name": "Java (OpenJDK 13.0.1)"
    },
    {
        "id": 63,
        "name": "JavaScript (Node.js 12.14.0)"
    },
    {
        "id": 64,
        "name": "Lua (5.3.5)"
    },
    {
        "id": 65,
        "name": "OCaml (4.09.0)"
    },
    {
        "id": 66,
        "name": "Octave (5.1.0)"
    },
    {
        "id": 67,
        "name": "Pascal (FPC 3.0.4)"
    },
    {
        "id": 68,
        "name": "PHP (7.4.1)"
    },
    {
        "id": 43,
        "name": "Plain Text"
    },
    {
        "id": 69,
        "name": "Prolog (GNU Prolog 1.4.5)"
    },
    {
        "id": 70,
        "name": "Python (2.7.17)"
    },
    {
        "id": 71,
        "name": "Python (3.8.1)"
    },
    {
        "id": 72,
        "name": "Ruby (2.7.0)"
    },
    {
        "id": 73,
        "name": "Rust (1.40.0)"
    },
    {
        "id": 74,
        "name": "TypeScript (3.7.4)"
    }
];

languages.forEach(lang => {
    require(`ace-builds/src-noconflict/mode-${lang}`);
    require(`ace-builds/src-noconflict/snippets/${lang}`);
});

themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

const defaultValue = `function onLoad(editor) {
  console.log("i've loaded");
}`;
const jwt = require('jsonwebtoken');



class EditorPage extends React.Component {


    constructor(props) {
        super(props);
        this.setMode = this.setMode.bind(this);
        this.ProgramName = React.createRef();
        this.code = React.createRef();
        this.input = React.createRef();
        this.output = React.createRef();
        this.handleSaveProgram = this.handleSaveProgram.bind(this);
        this.handleUpdateProgram = this.handleUpdateProgram.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.setLang = this.setLang.bind(this);
        this.handleExecution = this.handleExecution.bind(this);
        // this.getResult = this.getResult.bind(this);
    };

    state = {
        diagram: null,
        elementText: 'none',
        code: "",
        programs: null,
        programID: "",
        theme: "monokai",
        mode: "text",
        language: 71,
        loading: true,
        output: null

    }


    setTheme(e) {
        this.setState({
            theme: e.target.value
        });
    }
    setMode(e) {
        this.setState({
            mode: e.target.value
        });
    }

    setLang(e) {
        this.setState({
            language: e.target.value
        });
    }
    // handleCodeChange(e) {
    //     //e.preventDefault();
    //     console.log(this.code.current.value)
    //     try {
    //         const flowNew = FlowChart.parse(this.code.current.value);
    //         if (this.chart) {
    //             try {
    //                 this.chart.removeChild(this.chart.children[0]);
    //             } catch (err) {
    //                 console.log("Child Error", err)
    //             }

    //             flowNew.drawSVG(this.chart, this.opt);
    //         }
    //         this.setState({ code: this.code.current.value });
    //     } catch (err) {
    //         console.log("Syntax Error", err)
    //     }
    // }
    Name = ""
    Code = ""
    ProgramLanguage = ""
    // spaceID = ""
    // emailDomain = ""
    programDocID = ""
    resToken = ""
    handleSaveProgram(e) {
        e.preventDefault();
        // this.spaceID = localStorage.getItem('spaceID');
        // this.emailDomain = ""
        // if (localStorage.getItem('adminUsername')) {
        //     this.emailDomain = localStorage.getItem('adminUsername').split("@")[1];
        // }
        // else {
        //     this.emailDomain = localStorage.getItem('username').split("@")[1];
        // }
        console.log("Clicked: ", this.state);
        this.Name = this.ProgramName.current.value;
        this.Code = this.code.current.value;
        this.ProgramLanguage = this.state.language;
        this.AddNewProgram()
        // setTimeout(() => {
        //     this.getData();
        // }, 400)

    }

    AddNewProgram = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/addProgram", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                // spaceID: this.spaceID,
                // emailDomain: this.emailDomain,
                name: this.Name == "" ? "Untitled" : this.Name,
                code: this.Code,
                language: this.ProgramLanguage

            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Please type some code!");
        } else if (res.status === 201) {
            this.getData();
            window.alert("Program added Successfuly");
        }

    }
    //UPDATE FLOWCHART:--->
    handleUpdateProgram(e) {
        e.preventDefault();
        // this.spaceID = localStorage.getItem('spaceID');
        // this.emailDomain = ""
        // if (localStorage.getItem('adminUsername')) {
        //     this.emailDomain = localStorage.getItem('adminUsername').split("@")[1];
        // }
        // else {
        //     this.emailDomain = localStorage.getItem('username').split("@")[1];
        // }
        //console.log("Clicked");
        this.Name = this.ProgramName.current.value;
        this.Code = this.code.current.value;
        this.ProgramLanguage = this.state.language;
        this.UpdateProgram()
        setTimeout(() => {
            this.getData();
        }, 400)
    }
    UpdateProgram = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/updateProgram", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                programDocID: this.state.programID,
                // spaceID: this.spaceID,
                // emailDomain: this.emailDomain,
                name: this.Name,
                code: this.Code,
                language: this.ProgramLanguage,
                token: localStorage.getItem('token')
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Invalid Request");
        } else if (res.status === 201) {
            window.alert("Program updated Successfuly");
        }

    }

    handleDeletion(e) {
        this.programDocID = String(e);
        console.log("Clicked: Delete");
        this.DeleteProgram()
        setTimeout(() => {
            this.getData();
        }, 400)
    }

    DeleteProgram = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/removeProgram", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // spaceID: this.spaceID,
                // emailDomain: this.emailDomain,
                token: localStorage.getItem('token'),
                programDocID: this.programDocID
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Invalid Request");
        } else if (res.status === 201) {
            window.alert("Program deleted Successfuly");
        }

    }

    async getData() {
        // var emailDomain = ""
        // if (localStorage.getItem('adminUsername')) {
        //     emailDomain = localStorage.getItem('adminUsername').split("@")[1];
        // }
        // else {
        //     emailDomain = localStorage.getItem('username').split("@")[1];
        // }

        // console.log("Domain:", emailDomain);
        // const spaceID = localStorage.getItem('spaceID');
        var token = localStorage.getItem('token')
        const getSpaceProgramsURL = "https://spaces-server.herokuapp.com/viewSpacePrograms/" + `${token}`;
        console.log("Getting Data");
        axios.get(`${getSpaceProgramsURL}`).then((res) => {
            //console.log(this.state.tasks);
            // var Flowcharts = []
            // // for (var i = 0; i < res.data.length; i++) {
            // //     Flowcharts.push(res.data[i]);
            // // }
            console.log(res);
            console.log("loaded");
            this.setState({ programs: res.data, loading: false });
            // console.log(this.state.inProgressTasks);
        }).catch(err => {
            console.log(err);
        })
    }


    handleExecution = async () => {
        var options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: { base64_encoded: 'false', wait: 'true', fields: '*' },
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                'x-rapidapi-key': '660b1b0592mshd89c4c4c022bd81p1ae439jsn3918f61d8b30',
            },
            data: {
                language_id: this.state.language,
                source_code: this.code.current.value,
                stdin: this.input.current.value == null ? "" : this.input.current.value
            }
        };
        console.log(options.data)
        var self = this;
        axios.request(options).then(function (response) {
            console.log(response.data);
            self.output.current.value = response.data.stdout;
            // self.output.current.value = "YOYOYOO";
            //console.log(response.data.token);
            // setTimeout(() => {
            //     window.alert("executing");
            //     this.resToken = response.data.token;
            //     this.getResult();
            // }, 1000)
        }).catch(function (error) {
            console.error(error);
        });

    }

    ////
    // getResult = async () => {
    //     console.log("RESULT: ", this.resToken)
    //     var options = {
    //         method: 'GET',
    //         url: 'https://judge0-ce.p.rapidapi.com/submissions/' + `${this.resToken}`,
    //         params: { base64_encoded: 'true', fields: '*' },
    //         headers: {
    //             'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    //             'x-rapidapi-key': '660b1b0592mshd89c4c4c022bd81p1ae439jsn3918f61d8b30'
    //         }
    //     };

    //     axios.request(options).then(function (response) {
    //         console.log("Result: ", response.data);

    //     }).catch(function (error) {
    //         console.error(error);
    //     });
    // }
    ////




    componentWillMount() {
        this.getData();
    }


    render() {
        console.log("re-rendered");
        let sidebar;
        if (localStorage.getItem("token")) {
            var token = jwt.decode(localStorage.getItem("token"));
            console.log("Decoded Token: ", token);
            console.log(Date.now());
            if (Date.now() <= token.exp * 1000) {
                console.log("Token Not Expired");
                sidebar = <Sidebar />;
            } else {
                console.log("Token Expired");
                localStorage.clear();
                return (
                    <>
                        {/* window.alert("Your Session Has Expired. Please Login"); */}
                        <Redirect to="/" />
                    </>
                );
            }
        } else {
            localStorage.clear();
            return (
                <>
                    {/* window.alert("Your Session Details are not Available. Please Login"); */}
                    <Redirect to="/" />
                </>
            );
        }

        // if (localStorage.getItem('adminUsername')) {
        //     sidebar = <Sidebar />
        // } else {
        //     sidebar = <SidebarDeveloper />
        // }
        if (this.state.loading) {
            return (
                <div class="load_data">
                    <div class="loader"></div>
                    <br />
                    Loading
                </div>
            );
        } else {
            return (
                <Fragment>
                    <Navbar />
                    <div class="wrapper">
                        {sidebar}
                        <div class="previous-flowchart-container">
                            <div class="previous-flowcharts-heading">
                                <p>Saved programs</p>
                            </div>

                            <br></br>
                            {this.state.programs
                                ? this.state.programs.map((program) => (
                                    <div
                                        class={
                                            this.state.programID === program._id
                                                ? "previous-flowchart-elements active"
                                                : "previous-flowchart-elements"
                                        }
                                        id="first_flowchart_element"
                                        onClick={() => {
                                            this.code.current.value = program.code;
                                            this.ProgramName.current.value = program.name;
                                            this.setState({ programID: program._id });
                                            // this.handleCodeChange();
                                        }}
                                    >
                                        <p>{program.name}</p>
                                        <button
                                            onClick={() => {
                                                this.handleDeletion(program._id);
                                            }}
                                        >
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                ))
                                : ""}
                            {/* 
        <div class="previous-flowchart-elements" id="first_flowchart_element">
            <p>Flowchart1</p>
        </div>

        <div class="previous-flowchart-elements">
            <p>Flowchart2</p>
        </div>

        <div class="previous-flowchart-elements">
            <p>Flowchart3</p>
        </div> */}
                        </div>
                        <div class="main_content">
                            <div class="main_content_flowchart">
                                <div class="header">
                                    {/* <h1>Flowchart</h1>
                                <br />
                                <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
                            </div> */}
                                    <div class="flowchart">
                                        <div class="flowchart-whole-container">
                                            <div class="flowchart-row">
                                                <div class="flowchart-name-row">
                                                    <p>Enter name of program</p>
                                                    <input
                                                        type="text"
                                                        ref={this.ProgramName}
                                                        placeholder="Program Name"
                                                    />
                                                </div>

                                                <br />
                                                <br />

                                                {/* <p>Edit flowchart in real time!</p> */}

                                                <div class="flowchart-code-area">
                                                    <br />
                                                    <br />

                                                    <div id="ACE">
                                                        <div className="ace-dropdown-row">
                                                            <div className="field">
                                                                <label>Theme:</label>
                                                                <p className="control">
                                                                    <span className="select">
                                                                        <select
                                                                            name="Theme"
                                                                            onChange={this.setTheme}
                                                                            value={this.state.theme}
                                                                        >
                                                                            {themes.map((lang) => (
                                                                                <option key={lang} value={lang}>
                                                                                    {lang}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            <div className="field">
                                                                <label>Editor Mode:</label>
                                                                <p className="control">
                                                                    <span className="select">
                                                                        <select
                                                                            name="mode"
                                                                            onChange={this.setMode}
                                                                            value={this.state.mode}
                                                                        >
                                                                            {languages.map((lang) => (
                                                                                <option key={lang} value={lang}>
                                                                                    {lang}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </span>
                                                                </p>
                                                            </div>


                                                            <div className="field">
                                                                <label>Language:</label>
                                                                <p className="control">
                                                                    <span className="select">
                                                                        <select
                                                                            name="language"
                                                                            onChange={this.setLang}
                                                                            value={this.state.language}
                                                                        >
                                                                            {compiler_languages.map((lang) => (
                                                                                <option key={lang.id} value={lang.id}>
                                                                                    {lang.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <AceEditor
                                                            mode={this.state.mode}
                                                            theme={this.state.theme}
                                                            value={
                                                                this.code.current == null
                                                                    ? ""
                                                                    : this.code.current.value
                                                            }
                                                            setOptions={{
                                                                enableBasicAutocompletion: true,
                                                                enableLiveAutocompletion: true,
                                                                enableSnippets: true
                                                            }}
                                                            //onChange={onChange}
                                                            //name="ACE"
                                                            //editorProps={{ $blockScrolling: true }}
                                                            ref={this.code}
                                                            onChange={(val) => {
                                                                this.code.current.value = val;
                                                                // this.handleCodeChange();
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="editor-box-row">
                                                        <div>
                                                            <h3>Input</h3>
                                                            <textarea
                                                                class="editor-input-box"
                                                                cols="80"
                                                                rows="10"
                                                                style={{ color: "white", display: "block" }}
                                                                ref={this.input}
                                                            />
                                                        </div>

                                                        <div>
                                                            <h3>Output</h3>
                                                            <textarea
                                                                class="editor-output-box"
                                                                cols="80"
                                                                rows="10"
                                                                style={{ color: "white", display: "block" }}
                                                                ref={this.output}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* </div> */}

                                                    <br></br>
                                                    <br></br>

                                                    {/* <div class="break"></div> */}
                                                    {/* <hr></hr> */}
                                                </div>

                                                <br />
                                            </div>
                                        </div>
                                        <div class="common-dialog-box-buttons-row">
                                            <button
                                                class="common-dialog-box-confirm-button"
                                                onClick={this.handleExecution}
                                            >
                                                Execute
                                            </button>

                                            <button
                                                class="common-dialog-box-cancel-button"
                                                onClick={this.handleSaveProgram}
                                            >
                                                Save code to backend
                                            </button>

                                            {this.state.programID.trim() != "" ? (
                                                <div class="common-dialog-box-buttons-row">
                                                    <button
                                                        class="common-dialog-box-confirm-button"
                                                        onClick={this.handleUpdateProgram}
                                                    >
                                                        Update Program
                                                    </button>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        }


    }
}

export default EditorPage


