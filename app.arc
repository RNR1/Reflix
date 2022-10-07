@app
reflix-revisited-f59f

@aws
  region us-east-1

@http
/*
  method any
  src server

@static

@tables
profile
  username *String

favorite
  profile *String  # profile
  movieId *String # movieId
