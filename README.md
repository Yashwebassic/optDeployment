## Hecone OTP

### Dockerize 
```
aws ecr get-login-password --region ap-south-1 --profile webassic| docker login --username AWS --password-stdin  689062882747.dkr.ecr.ap-south-1.amazonaws.com
```
```
docker build -t 689062882747.dkr.ecr.ap-south-1.amazonaws.com/hecotp .
```

```
docker push 689062882747.dkr.ecr.ap-south-1.amazonaws.com/hecotp

```

