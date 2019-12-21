## 1. Enroll admin

- orgid {String} (default: student}

```bash
node enrollAdmin.js --orgMSP=[OrgName] --username=[username]
```

#### Example:

enrollAdmin Org bachmai:

```bash
	node enrollAdmin.js --username=conglt
```

enrollAdmin Org choray:

```bash
	node enrollAdmin.js --orgMSP=choray --username=conglt
```

## 2. Register user

- orgid {String} (default: bachmai}
- userid {String} (required)

```bash
	node registerUser.js --username=[username] --orgMSP=[OrgName] --fullname=[Fullname]
```

## Enroll admin and register user with `intit.sh`

```bash
chmod +x ./init.sh
./init.sh
```
