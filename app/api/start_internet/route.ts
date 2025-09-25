 const convertLimitUptime =
      mikrotikTimeParser(query.rows[0].uptime_limit) || "";
    const convertUptime = mikrotikTimeParser(query.rows[0].uptime) || "";
    console.log(convertLimitUptime);
    console.log(convertUptime);
    const calculateLimit = await ActualRemainingTime(
      convertLimitUptime,
      convertUptime
    );

    
    const createAcc = await createCustomer(
      query.rows[0].shadow_account_name,
      query.rows[0].shadow_account_password,
      calculateLimit,
      query.rows[0].uptime
    );

    if(createAcc){
      return NextResponse.json({code:500,message:"Something went wrong creating session.Please contact operator."})
    }

    const loginHotspot = await AuthenticateHotspot(
      query.rows[0].shadow_account_name,
      query.rows[0].shadow_account_password,
      requestorIP
    );

    if (!loginHotspot) {
      return NextResponse.json({
        message: "Error authenticating to server,Please contact operator !",
        code: 500,
      });
    }