# _Horse-mackerel_ project

## Installation

```console
npm i
```

## Configuration

Create a file with your profile data in _profiles_.
You can copy and edit the following sample file _profiles/sigerico.js_.

## Run

The name must be the same as the profile file.

```console
node signup.js sigerico aldabe jueves 17:00
```

## Schedule it

```console
crontab -e
```

And add a line like this one (make sure that it is run whenever they open the reservation slots!):

```
30 8 27 04 *    cd ~/piscina; node signup.js sigerico aldabe jueves 17:00
```
