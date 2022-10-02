# :zap: GitHub Action to run ZAP Automation Framework

An action that runs [OWASP ZAProxy](https://www.zaproxy.org/)'s
[Automation Framework](https://www.zaproxy.org/docs/desktop/addons/automation-framework/), to scan a web application 
and get analysis results both as an issue and/or as an action artifact.

> :bangbang: WARNING! This action is still under development and hasn't been tested thoroughly. Use it at your own risk!!!

## :book: Contents
- [Mandatory Warnings](#bangbang-mandatory-warnings)
- [Introduction](#nerd_face-introduction)
- [Advanced Configuration](#detective-advanced-configuration)
   - [Reports and Artifacts](#memo-reports-and-artifacts)
   - [Annotations](#octocat-annotations)
   - [Reporting in Issues](#octocat-reporting-in-issues)
- [Usage](#memo-usage)
- [License](#scroll-license)
- [Contributions](#1-contributions)


## :bangbang: MANDATORY WARNINGS

 - This action uses [OWASP ZAProxy](https://www.zaproxy.org/) to perform **ACTUAL** attacks on the target website!
 - You should only scan targets **you have permission to test**!
 - You should also check with your hosting provider and any other services the target site relies on, prior to executing a test on your target. 
 - In case you have configured ZAP to post forms, please be prepared to find a ton of garbage data in your database(s).
 - Never, **ever**, scan your production targets, as the process might impact the actual service.
 - Never, **ever**, **EVER**, store secrets in your repository (such as passwords, access keys, etc.). Instead modify your configuration in such a way, these secrets are obtained from a secure source (e.g. Repository Secrets). 

## :nerd_face: Introduction

While both the [Baseline Action](https://github.com/zaproxy/action-baseline) and
the [Full Scan Action](https://github.com/zaproxy/action-full-scan) do their job magnificently,
when there is a need for extra customization and/or automation of security testing, they are not enough.

This action simplifies the usage of ZAP's Automation Framework, by automating certain steps of the process
and, at the same time, it can act a basis for creating your custom workflow, which will leverage the
entirety of Automation Framework's features.

> :bangbang: Properly configuring the Automation Framework can be a PITA. 
> Please consult the [Automation Framework Configuration Guide](doc/AutomationFramework.md)
on how you will properly configure the Automation Framework so that it can be used with this action.

### Basic Setup

In its simplest form, the action can be set up like this:
```yaml
- name: Run ZAP Automation Framework
  uses: MisterIcy/zap-automation-framework
  with:
    config-dir: 'zap-config'
    autorun-file: 'autorun.yaml'
```

This will pull the `owasp/zap2docker-stable` mount the `zap-config` directory to `/zap/zap-config` inside a container and
then execute `/zap/zap.sh -cmd -autorun /zap/zap-config/autorun.yaml`. 

> As simple as that.

## :detective: Advanced Configuration

### :memo: Reports And Artifacts

Assuming that you have an automation framework configuration that produces various
reports regarding your scan, you can tell the action to create a zip file out of 
them and upload it as an artifact in the action:

```yaml
  - type: report
    parameters:
      template: 'traditional-html'
      reportDir: '/zap/reports'
      reportFile: 'traditional-report.html'
      reportTitle: 'Traditional Report'
      reportDescription: 'Your Description'
      displayReport: false
    risks:
      - high
      - medium
      - low
      - info
    confidences:
      - high
      - medium
      - low
      - falsepositive
    sections:
```

Since this configuration saves the reports in the default `reports-dir`,
you don't have to specify the directory where the reports will be generated.

In case you wanted to generate the reports in a directory other than the default,
you would have to specify it by using the `reports-dir` input:

```yaml
- name: Run ZAP Automation Framework
  uses: MisterIcy/zap-automation-framework
  with:
    config-dir: 'zap-config'
    autorun-file: 'autorun.yaml'
    reports-dir: 'reports'
```

### :octocat: Annotations

Since version 0.2.0, the action is able to create annotations in the workflow.
In order for this to work, your configuration will **at least** need to define
an `outputSummary` job:

```yaml
- parameters:
    format: "long"
    summaryFile: "/zap/report/zap-summary.json"
  rules: []
  name: "outputSummary"
  type: "outputSummary"
```

Then your setup will look like this:


```yaml
- name: Run ZAP Automation Framework
  uses: MisterIcy/zap-automation-framework
  with:
    config-dir: 'zap-config'
    autorun-file: 'autorun.yaml'
    reports-dir: 'reports'
    summary-json: 'zap-summary.json'
    create-annotations: true
```


### :octocat: Reporting in issues

As with Annotations, in order to create and/or update an issue,
your configuration will **at least** need to define an `outputSummary` job:

```yaml
- parameters:
    format: "long"
    summaryFile: "/zap/report/zap-summary.json"
  rules: []
  name: "outputSummary"
  type: "outputSummary"
```

The contents of the file will look like this:

```json
{
  "pass": 10,
  "warn": 5,
  "fail": 1
}
```

Then you'll have to configure the action's step in order to use the summary file.

```yaml
- name: Run ZAP Automation Framework
  uses: MisterIcy/zap-automation-framework
  with:
    config-dir: 'zap-config'
    autorun-file: 'autorun.yaml'
    reports-dir: 'reports'
    create-issue: true
    summary-file: 'zap-summary.json'
```

In case the action detects warnings or failures, it will open a new issue in your repository, stating
that the analysis of the scan discovered the aforementioned warnings and/or failures.

Now, if you need something more detailed, you'll have to supply a report of the `traditional-json` type:

```yaml
  - type: report
    parameters:
      template: 'traditional-json'
      reportDir: 'reports'
      reportFile: 'report.json'
      reportTitle: 'Traditional Report'
      reportDescription: 'Your Description'
      displayReport: false
    risks:
      - high
      - medium
      - low
      - info
    confidences:
      - high
      - medium
      - low
      - falsepositive
```

Configure your action accordingly:

```yaml
- name: Run ZAP Automation Framework
  uses: MisterIcy/zap-automation-framework
  with:
    config-dir: 'zap-config'
    autorun-file: 'autorun.yaml'
    reports-dir: 'reports'
    create-issue: true
    json-file: 'report.json'
```

## :memo: Usage

### Inputs
> Specify using `with` keyword:

#### `config-dir` (Required)
- The directory that contains the automation framework configuration and any other relevant files (e.g. scripts) which must be available to ZAP during the execution of the scan.
- Accepts a `string` (e.g. `zap-config`)
- The directory must be relative to the `$GITHUB_WORKSPACE` directory.
- The directory will be mounted under `/zap` in the container. For example, if your configuration dir is `zap-config`, the directory in the container will be accessible via `/zap/zap-config`.

#### `reports-dir` (Optional)
- The directory where reports will be stored after their production.
- Accepts a `string` (e.g. `zap-artifacts`).
- The directory must be relative to the `$GITHUB_WORKSPACE` directory.
- As with the `config-dir` input, the directory will be mounted under `/zap` in the container.
- By default, has the value of `zap-artifacts`.

#### `autorun-file` (Required)
- The actual configuration that will be used by the automation framework.
- Accepts a `string` (e.g. `autorun.yaml`).
- The file **MUST** exist in the `config-dir`.

#### `docker-image` (Optional)
- The docker image which will be used to run zap.
- Accepts a `string`.
- By default, the action uses the `owasp/zap2docker-stable` image.

#### `create-issue` (Optional)
- That an issue should be created if the reports contain any alerts.
- Accepts a `boolean` (e.g. `true`)
- You must either specify a `summary-file` or a `json-file` for the issue to be produced.

#### `summary-file` (Optional)
- The file produced by the `outputSummary` job of the automation framework.
- Accepts a `string` (e.g. `summary.json`)
- The file needs to be relative to the `reports-dir` directory.

#### `json-file` (Optional)
- The file produced by a `report` job of the automation file, with `reportType` equal to `traditional-json`.
- Accepts a `string` (e.g. `report.json`)
- The file needs to be relative to the `reports-dir` directory.

#### `issue-title` (Optional)
- The title of the issue to be created.
- Accepts a `string` (e.g. `ZAP Scan Findings`).
- In case it exists, the action will update the issue's body.

#### `token` (Optional)
- The GitHub Token used to create issues in the repository
- Defaults to `${{ github.token }}`

#### `create-annotations` (Optional)
- Set to `true` in order for the action to produce annotations when the Scanner has determined that the application has issues
- Accepts a `boolean`.
- You must either specify a `summary-file` or a `json-file` for the annotations to be written.

## :scroll: License

- This project is licensed under the [MIT License](LICENSE "License for MisterIcy/zap-automation-framework")

## :+1: Contributions

> Contributions are always welcome!

