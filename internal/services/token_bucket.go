package services

import (
	"context"

	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
)

type token_bucket struct {
	repo *repository.Algo
}
func  NewTokenBucketService (repo *repository.Algo) (t *token_bucket) {
	return &token_bucket{repo: repo}
} 
func (t *token_bucket) Allow(ctx context.Context, key string, window, limit int )(models.RateLimitResponse,error){
	res,err := t.repo.CheckTokenBucket_via_Lua(ctx ,key ,window,limit,"token_bucket")
	//here window is the time it takes two completely fill the bucket 	
	if err!= nil{
		return models.RateLimitResponse{},err
	}
	return models.RateLimitResponse{
		Allowed: res.Allowed,
		Remaining: res.Remaining,
	},nil


}

