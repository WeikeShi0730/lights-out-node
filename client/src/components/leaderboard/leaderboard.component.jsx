import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setLeaderboard } from "../../redux/actions/leaderboard.action";
import UserService from "../../services/user-service";

import IndividualPlayer from "../individual-player/individual-player.component";

const Leaderboard = ({ currentUser, leaderboard, setLeaderboard }) => {
  const fecthData = async () => {
    try {
      const fetchedData = await UserService.getAll();
      const data = fetchedData.data;
      setLeaderboard(data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fecthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dot = () => {
    return (
      <div className="grid gap-x-4 grid-cols-2">
        <div className="mx-10">...</div>
      </div>
    );
  };

  const leaderboardList = () => {
    const numberOfUser = leaderboard.length;
    const numberOfUsersDisplay =
      leaderboard.length > 10 ? 10 : leaderboard.length;
    const currentUserRanking = currentUser
      ? leaderboard.findIndex((user) => user.id === currentUser.id) + 1
      : -1;
    const lastPlace = leaderboard[leaderboard.length - 1];
    const lastPlaceRanking = leaderboard.length;

    if (currentUser) {
      if (currentUserRanking <= 10) {
        return (
          <div>
            {leaderboard.slice(0, numberOfUsersDisplay).map((user, i) => (
              <IndividualPlayer key={i} user={user} ranking={i + 1} />
            ))}
            {lastPlaceRanking > 10 ? (
              <div>
                {dot()}
                <IndividualPlayer user={lastPlace} ranking={lastPlaceRanking} />
              </div>
            ) : (
              ""
            )}
          </div>
        );
      } else {
        return (
          <div>
            {leaderboard.slice(0, numberOfUsersDisplay).map((user, i) => (
              <IndividualPlayer key={i} user={user} ranking={i + 1} />
            ))}
            {currentUserRanking > 11 ? dot() : ""}
            <IndividualPlayer user={currentUser} ranking={currentUserRanking} />
            {lastPlaceRanking - currentUserRanking > 0 ? (
              lastPlaceRanking - currentUserRanking > 1 ? (
                <div>
                  {dot()}
                  <IndividualPlayer
                    user={lastPlace}
                    ranking={lastPlaceRanking}
                  />
                </div>
              ) : (
                <IndividualPlayer user={lastPlace} ranking={lastPlaceRanking} />
              )
            ) : (
              ""
            )}
          </div>
        );
      }
    } else {
      if (numberOfUser <= 10) {
        return leaderboard
          .slice(0, numberOfUsersDisplay)
          .map((user, i) => (
            <IndividualPlayer key={i} user={user} ranking={i + 1} />
          ));
      } else {
        return (
          <div>
            {leaderboard.slice(0, numberOfUsersDisplay).map((user, i) => (
              <IndividualPlayer key={i} user={user} ranking={i + 1} />
            ))}
            {dot()}
            <IndividualPlayer user={lastPlace} ranking={lastPlaceRanking} />
          </div>
        );
      }
    }
  };

  return (
    <div>
      <h1 className="flex justify-center text-sm md:text-base lg:text-lg">
        leaderboard
      </h1>
      <div className="text-xs sm:text-sm lg:text-base">
        {leaderboard ? leaderboardList() : "Loading..."}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  leaderboard: state.leaderboard.leaderboard,
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, { setLeaderboard })(Leaderboard);
